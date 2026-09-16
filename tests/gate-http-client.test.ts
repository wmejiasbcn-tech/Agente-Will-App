/**
 * T-F / fabrication guards for Node Gate client (no live Python required for fail-closed).
 */
import assert from "assert";
import { callGateClose } from "../api/verificationGate";

async function main() {
  // Ensure no secret/base → fail closed, never AUTHORIZED
  delete process.env.GATE_SHARED_SECRET;
  delete process.env.GATE_PYTHON_BASE_URL;
  delete process.env.VERCEL_URL;

  const { payload } = await callGateClose({ id: "T-F" });
  assert.strictEqual(payload.closed, false, "T-F closed");
  assert.strictEqual(payload.gate_status, "BLOCKED", "T-F blocked");
  assert.notStrictEqual(payload.gate_status, "AUTHORIZED");
  console.log("T-F OK", payload.fail_closed_reason);

  // Unreachable host
  process.env.GATE_SHARED_SECRET = "test-secret-please-rotate";
  process.env.GATE_PYTHON_BASE_URL = "http://127.0.0.1:9";
  process.env.GATE_HTTP_TIMEOUT_MS = "500";
  const r2 = await callGateClose({ id: "T-F2" });
  assert.strictEqual(r2.payload.closed, false);
  assert.strictEqual(r2.payload.gate_status, "BLOCKED");
  console.log("T-F unreachable OK", r2.payload.fail_closed_reason);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
