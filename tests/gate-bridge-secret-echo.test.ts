import assert from "assert";
import express from "express";
import { registerVerificationGateRoutes } from "../api/verificationGate";

process.env.GATE_BRIDGE_TOKEN = "bridge-secret-SHOULD-NOT-LEAK";
process.env.GATE_SHARED_SECRET = "python-secret-SHOULD-NOT-LEAK";
process.env.GATE_PYTHON_BASE_URL = "http://127.0.0.1:9";
process.env.GATE_HTTP_TIMEOUT_MS = "200";

const app = express();
app.use(express.json());
registerVerificationGateRoutes(app);

const s = app.listen(0, "127.0.0.1", async () => {
  const port = (s.address() as any).port;
  const base = `http://127.0.0.1:${port}`;
  for (const path of ["/api/verification-gate", "/api/verification-gate/verify"]) {
    const r = await fetch(base + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycle: {}, receipt: {} }),
    });
    const t = await r.text();
    assert.ok(!t.includes("bridge-secret-SHOULD-NOT-LEAK"), path + " leaked bridge");
    assert.ok(!t.includes("python-secret-SHOULD-NOT-LEAK"), path + " leaked shared");
    assert.strictEqual(r.status, 401);
  }
  const r2 = await fetch(base + "/api/verification-gate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer bridge-secret-SHOULD-NOT-LEAK",
    },
    body: "{}",
  });
  const t2 = await r2.text();
  assert.ok(!t2.includes("bridge-secret-SHOULD-NOT-LEAK"));
  assert.ok(!t2.includes("python-secret-SHOULD-NOT-LEAK"));
  console.log("E secret-non-echo OK");
  s.close();
});

