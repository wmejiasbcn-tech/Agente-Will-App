/**
 * Contrato S2S: SENTINEL → GATE_BRIDGE_TOKEN → Node → GATE_SHARED_SECRET → Python Gate
 */
import assert from "assert";
import { spawn, type ChildProcess } from "child_process";
import express from "express";
import type { Server } from "http";
import { setTimeout as sleep } from "timers/promises";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fs from "fs";
import { registerVerificationGateRoutes } from "../api/verificationGate";

const ROOT = path.resolve(__dirname, "..");
const CASES = path.join(ROOT, "waipl_verification_gate", "will_app_cases");

async function main() {
  const bridgeToken = "s2s-bridge-token-test-only";
  const shared = "s2s-python-shared-test-only";
  process.env.GATE_BRIDGE_TOKEN = bridgeToken;
  process.env.GATE_SHARED_SECRET = shared;
  process.env.GATE_HTTP_TIMEOUT_MS = "8000";

  const stubPort = 18765;
  process.env.GATE_PYTHON_BASE_URL = `http://127.0.0.1:${stubPort}`;

  const stub: ChildProcess = spawn(
    process.env.PYTHON || "python",
    [path.join(ROOT, "scripts", "local_gate_stub.py")],
    {
      env: { ...process.env, GATE_SHARED_SECRET: shared, GATE_STUB_PORT: String(stubPort) },
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  stub.stdout?.on("data", () => {});
  stub.stderr?.on("data", () => {});

  try {
    const t0 = Date.now();
    while (Date.now() - t0 < 20000) {
      try {
        const r = await fetch(`http://127.0.0.1:${stubPort}/api/gate/close`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
        if (r.status === 401 || r.status === 200) break;
      } catch {
        /* retry */
      }
      await sleep(150);
    }

    const app = express();
    app.use(express.json({ limit: "256kb" }));
    registerVerificationGateRoutes(app);
    const server: Server = await new Promise((resolve) => {
      const s = app.listen(0, "127.0.0.1", () => resolve(s));
    });
    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("no port");
    const base = `http://127.0.0.1:${addr.port}`;

    const A = JSON.parse(fs.readFileSync(path.join(CASES, "WILL_AUDIT_A_INCOMPLETO.json"), "utf8"));
    const B = JSON.parse(fs.readFileSync(path.join(CASES, "WILL_AUDIT_B_COMPLETO.json"), "utf8"));

    const anon = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(B),
    });
    const anonJ = (await anon.json()) as any;
    assert.strictEqual(anon.status, 401);
    assert.notStrictEqual(anonJ.gate_status, "AUTHORIZED");
    assert.strictEqual(anonJ.closed, false);
    console.log("CONTRACT anon→401 OK", anonJ.fail_closed_reason);

    const authH = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bridgeToken}`,
    };

    const ta = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: authH,
      body: JSON.stringify(A),
    });
    const taJ = (await ta.json()) as any;
    const taFs = taJ.final_state || taJ;
    assert.strictEqual(ta.status, 200);
    assert.strictEqual(taFs.gate_status, "BLOCKED");
    assert.strictEqual(taFs.closed, false);
    console.log("T-A S2S OK", taFs.state, taFs.gate_status);

    const tb = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: authH,
      body: JSON.stringify(B),
    });
    const tbJ = (await tb.json()) as any;
    const tbFs = tbJ.final_state || tbJ;
    assert.strictEqual(tb.status, 200);
    assert.strictEqual(tbFs.gate_status, "AUTHORIZED");
    assert.strictEqual(tbFs.closed, true);
    assert.ok(tbFs.receipt);
    const tbText = JSON.stringify(tbJ);
    assert.ok(!tbText.includes(bridgeToken));
    assert.ok(!tbText.includes(shared));
    console.log("T-B S2S OK receipt present");

    const tr = await fetch(`${base}/api/verification-gate/verify`, {
      method: "POST",
      headers: authH,
      body: JSON.stringify({ cycle: B, receipt: tbFs.receipt }),
    });
    const trJ = (await tr.json()) as any;
    assert.strictEqual(tr.status, 200);
    assert.strictEqual(trJ.ok, true);
    console.log("T-R S2S OK");

    const tf = await fetch(`http://127.0.0.1:${stubPort}/api/gate/close`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(B),
    });
    const tfJ = (await tf.json()) as any;
    assert.strictEqual(tf.status, 401);
    assert.notStrictEqual(tfJ.gate_status, "AUTHORIZED");
    console.log("T-F direct Python fail-closed OK", tfJ.reason);

    const tx = await fetch(`http://127.0.0.1:${stubPort}/api/gate/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer wrong",
        "X-WAIPL-Timestamp": String(Math.floor(Date.now() / 1000)),
        "X-WAIPL-Signature": "0".repeat(64),
      },
      body: JSON.stringify(B),
    });
    const txJ = (await tx.json()) as any;
    assert.strictEqual(tx.status, 401);
    assert.notStrictEqual(txJ.gate_status, "AUTHORIZED");
    console.log("T-X rejection OK", txJ.reason);

    console.log("S2S CONTRACT + FUNCTIONAL PASS");
    await new Promise<void>((r) => server.close(() => r()));
  } finally {
    stub.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

