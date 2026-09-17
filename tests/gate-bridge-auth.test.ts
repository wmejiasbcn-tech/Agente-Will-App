/**
 * Bridge surface auth: anonymous must not reach Node->Python signing.
 */
import assert from "assert";
import express from "express";
import type { Server } from "http";
import { registerVerificationGateRoutes } from "../api/verificationGate";

async function withServer(fn: (base: string) => Promise<void>) {
  const app = express();
  app.use(express.json({ limit: "256kb" }));
  registerVerificationGateRoutes(app);
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(0, "127.0.0.1", () => resolve(s));
  });
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no port");
  const base = `http://127.0.0.1:${addr.port}`;
  try {
    await fn(base);
  } finally {
    await new Promise<void>((r) => server.close(() => r()));
  }
}

async function main() {
  delete process.env.GATE_BRIDGE_TOKEN;
  process.env.GATE_SHARED_SECRET = "node-python-secret-not-for-client";
  process.env.GATE_PYTHON_BASE_URL = "http://127.0.0.1:9";
  process.env.GATE_HTTP_TIMEOUT_MS = "300";

  await withServer(async (base) => {
    const r1 = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "anon" }),
    });
    const j1 = (await r1.json()) as any;
    assert.strictEqual(r1.status, 401, "anon status");
    assert.strictEqual(j1.closed, false);
    assert.strictEqual(j1.gate_status, "BLOCKED");
    assert.notStrictEqual(j1.gate_status, "AUTHORIZED");
    console.log("anon rejected OK", j1.fail_closed_reason);

    process.env.GATE_BRIDGE_TOKEN = "correct-bridge-token";
    const r2 = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer wrong" },
      body: JSON.stringify({ id: "bad" }),
    });
    const j2 = (await r2.json()) as any;
    assert.strictEqual(r2.status, 401);
    assert.strictEqual(j2.gate_status, "BLOCKED");
    console.log("bad bearer rejected OK", j2.fail_closed_reason);

    const r3 = await fetch(`${base}/api/verification-gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer correct-bridge-token" },
      body: JSON.stringify({ id: "ok-auth" }),
    });
    const j3 = (await r3.json()) as any;
    assert.strictEqual(r3.status, 200, "authed status");
    assert.strictEqual(j3.ok, false);
    assert.strictEqual(j3.final_state?.closed, false);
    assert.strictEqual(j3.final_state?.gate_status, "BLOCKED");
    assert.ok(String(j3.final_state?.fail_closed_reason || "").length > 0);
    console.log("authed reaches Node->Python path OK", j3.final_state?.fail_closed_reason);

    const r4 = await fetch(`${base}/api/verification-gate/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycle: {}, receipt: {} }),
    });
    assert.strictEqual(r4.status, 401);
    console.log("verify anon rejected OK");
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
