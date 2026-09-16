/**
 * Bridge mínimo Will App → WAIPL Verification Gate v1.0 (SENTINEL).
 * Punto de integración: ciclos verificables (p. ej. salida de POST /api/audit).
 * No reimplementa el Gate: ejecuta waipl_verification_gate/will_app_adapter.py
 */
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function runAdapter(cycle: unknown): Promise<{ code: number; stdout: string; stderr: string }> {
  const gateDir = path.join(process.cwd(), 'waipl_verification_gate');
  const tmp = path.join(os.tmpdir(), `will-gate-${Date.now()}.json`);
  fs.writeFileSync(tmp, JSON.stringify(cycle), 'utf8');
  const py = process.env.PYTHON || 'python3';
  const script = path.join(gateDir, 'will_app_adapter.py');
  return new Promise((resolve) => {
    const child = spawn(py, [script, tmp], { cwd: gateDir });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d.toString()));
    child.stderr.on('data', (d) => (stderr += d.toString()));
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });
}

export async function handleVerificationGate(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'POST only' }));
    return;
  }
  try {
    const body = JSON.parse(await readBody(req));
    const { code, stdout, stderr } = await runAdapter(body);
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(stdout);
    } catch {
      parsed = { raw: stdout, stderr };
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        ok: code === 0,
        adapter_exit: code,
        final_state: parsed,
        note: 'No Gate authorization, no closure. Logic from SENTINEL Gate v1.0.',
      }),
    );
  } catch (e: any) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(e?.message || e), stderr_hint: 'Python Gate required on host' }));
  }
}
