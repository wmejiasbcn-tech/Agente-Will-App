/**
 * Will App → WAIPL Verification Gate v1.0
 * Transport: HTTPS to Vercel Python Function (no spawn/python).
 * Fail-closed: never fabricate AUTHORIZED or CLOSED=true.
 */
import crypto from "crypto";
import type { Express, Request, Response } from "express";

const TIMEOUT_MS = Number(process.env.GATE_HTTP_TIMEOUT_MS || 15000);
const MAX_BODY = 256 * 1024;

type FailClosed = {
  state: "AMARILLO";
  closed: false;
  open: true;
  gate_status: "BLOCKED";
  result_status: "AUSENTE";
  evidence_status: "INSUFICIENTE";
  verification_status: "NO_VERIFICADO";
  dictamen_status: "NO_CERRABLE";
  mandatory_requirements_pending: Array<{ id: string; estado: string }>;
  gate_ref: string;
  fail_closed_reason: string;
};

function failClosed(reason: string): FailClosed {
  return {
    state: "AMARILLO",
    closed: false,
    open: true,
    gate_status: "BLOCKED",
    result_status: "AUSENTE",
    evidence_status: "INSUFICIENTE",
    verification_status: "NO_VERIFICADO",
    dictamen_status: "NO_CERRABLE",
    mandatory_requirements_pending: [{ id: "_runtime", estado: "DESCONOCIDO" }],
    gate_ref: "gate:v1.0:fail-closed",
    fail_closed_reason: reason,
  };
}

function gateBaseUrl(): string {
  const explicit = (process.env.GATE_PYTHON_BASE_URL || "").trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = (process.env.VERCEL_URL || "").trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;
  return "";
}

function sharedSecret(): string {
  return (process.env.GATE_SHARED_SECRET || "").trim();
}

function signHeaders(rawBody: string): Record<string, string> {
  const secret = sharedSecret();
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = crypto
    .createHmac("sha256", secret)
    .update(`${ts}.`)
    .update(rawBody)
    .digest("hex");
  return {
    Authorization: `Bearer ${secret}`,
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-WAIPL-Timestamp": ts,
    "X-WAIPL-Signature": sig,
  };
}

async function postGate(path: "/api/gate/close" | "/api/gate/verify", body: unknown): Promise<{
  httpStatus: number;
  payload: Record<string, unknown>;
}> {
  const secret = sharedSecret();
  if (!secret) {
    return { httpStatus: 503, payload: failClosed("GATE_SHARED_SECRET missing") };
  }
  const base = gateBaseUrl();
  if (!base) {
    return { httpStatus: 503, payload: failClosed("GATE_PYTHON_BASE_URL / VERCEL_URL missing") };
  }
  const rawBody = JSON.stringify(body ?? {});
  if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY) {
    return { httpStatus: 413, payload: failClosed("body too large") };
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      headers: signHeaders(rawBody),
      body: rawBody,
      signal: ctrl.signal,
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return { httpStatus: 502, payload: failClosed(`invalid_json_from_python:${res.status}`) };
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { httpStatus: 502, payload: failClosed("non_object_from_python") };
    }
    // Never promote closed/authorized if Python did not say so
    if (parsed.closed === true && parsed.gate_status !== "AUTHORIZED" && path === "/api/gate/close") {
      return { httpStatus: 502, payload: failClosed("inconsistent_authorized_closure") };
    }
    return { httpStatus: res.status, payload: parsed };
  } catch (e: any) {
    const reason =
      e?.name === "AbortError" ? "python_timeout" : `python_unreachable:${String(e?.message || e)}`;
    return { httpStatus: 503, payload: failClosed(reason) };
  } finally {
    clearTimeout(timer);
  }
}

function assertNoFabrication(payload: Record<string, unknown>): Record<string, unknown> {
  // Defense in depth: Node must not invent AUTHORIZED / CLOSED=true
  if (payload.gate_status === "AUTHORIZED" && payload.closed !== true) {
    return failClosed("node_refused_inconsistent_authorized");
  }
  if (payload.closed === true && payload.gate_status !== "AUTHORIZED") {
    return failClosed("node_refused_closed_without_authorized");
  }
  return payload;
}

export async function callGateClose(cycle: unknown) {
  const { httpStatus, payload } = await postGate("/api/gate/close", cycle);
  return { httpStatus, payload: assertNoFabrication(payload) };
}

export async function callGateVerify(cycle: unknown, receipt: unknown) {
  const { httpStatus, payload } = await postGate("/api/gate/verify", { cycle, receipt });
  return { httpStatus, payload };
}

export function registerVerificationGateRoutes(app: Express): void {
  app.post("/api/verification-gate", async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    const { httpStatus, payload } = await callGateClose(req.body);
    res.status(httpStatus >= 400 && httpStatus < 600 ? (httpStatus === 401 ? 401 : 200) : 200);
    // Always return body; fail-closed uses 200 with CLOSED=false for app consumers,
    // except auth failures to Python (401) and missing config (503 mapped to body).
    if (httpStatus === 401) {
      res.status(401).json(payload);
      return;
    }
    res.status(200).json({
      ok: payload.closed === true && payload.gate_status === "AUTHORIZED",
      final_state: payload,
      transport: "https-python-function",
      note: "No Gate authorization, no closure. Logic from SENTINEL Gate v1.0 pin.",
    });
  });

  app.post("/api/verification-gate/verify", async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    const cycle = req.body?.cycle ?? req.body?.case;
    const receipt = req.body?.receipt;
    if (!cycle || receipt === undefined) {
      res.status(400).json(failClosed("cycle and receipt required"));
      return;
    }
    const { payload } = await callGateVerify(cycle, receipt);
    res.status(200).json({
      ok: payload.accepted === true,
      verify: payload,
      transport: "https-python-function",
    });
  });
}
