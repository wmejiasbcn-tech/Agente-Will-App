import { spawn } from "node:child_process";

export type RagQueryContextResult = {
  text: string;
  status: "EXTERNAL_RETRIEVED_PENDING" | "NO_SUFFICIENT_EVIDENCE" | "UNAVAILABLE";
};

type BridgeEvidence = {
  external_id?: string;
  title?: string;
  url?: string;
  status?: string;
  metadata?: Record<string, unknown>;
};

type BridgeResponse = {
  source?: string;
  source_name?: string;
  query?: string;
  status?: string;
  evidences?: BridgeEvidence[];
  error?: string;
  message?: string;
};

type BridgeRunner = (query: string) => Promise<BridgeResponse>;

const CONSENSUS_ENDPOINT =
  process.env.CONSENSUS_API_ENDPOINT || "https://api.consensus.app/v1/search";

function buildContext(result: BridgeResponse): string {
  const evidences = Array.isArray(result.evidences) ? result.evidences.slice(0, 3) : [];
  if (!evidences.length) return "";

  const lines = evidences.map((evidence, index) => {
    const metadata = evidence.metadata || {};
    const journal = typeof metadata.journal_name === "string" ? metadata.journal_name : "";
    const year = metadata.publish_year != null ? String(metadata.publish_year) : "";
    const takeaway = typeof metadata.takeaway === "string" ? metadata.takeaway : "";
    const abstract = typeof metadata.abstract === "string" ? metadata.abstract : "";
    const detail = takeaway || abstract;
    return [
      `${index + 1}. ${evidence.title || "Sin título"}`,
      journal || year ? `   ${[journal, year].filter(Boolean).join(" · ")}` : "",
      detail ? `   ${detail.slice(0, 700)}` : "",
      evidence.url ? `   ${evidence.url}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    "CONTEXTO EXTERNO — CONSENSUS",
    "Estado: EXTERNAL_RETRIEVED_PENDING. Estas referencias son contexto externo recuperado en tiempo de consulta y NO equivalen a conocimiento admitido en el corpus ni a verificación independiente.",
    ...lines,
  ].join("\n");
}

function runProcess(
  command: string,
  args: string[],
  input: string,
  timeoutMs = 20_000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: process.env,
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(stdout);
    };

    const timer = setTimeout(() => {
      child.kill();
      finish(new Error("Consensus bridge timeout"));
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
      if (stdout.length > 512 * 1024) {
        child.kill();
        finish(new Error("Consensus bridge output too large"));
      }
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", finish);
    child.on("close", (code) => {
      if (code !== 0) {
        finish(new Error(stderr.trim() || `Consensus bridge exited with ${code}`));
        return;
      }
      finish();
    });

    child.stdin.end(input);
  });
}

function asOptionalString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

function normalizeConsensusHttp(query: string, payload: any): BridgeResponse {
  const rawResults = Array.isArray(payload?.results) ? payload.results : [];
  const evidences: BridgeEvidence[] = rawResults.slice(0, 3).map((paper: any) => {
    const url = asOptionalString(paper?.url) || "";
    const doi = asOptionalString(paper?.doi);
    const external_id =
      doi ||
      asOptionalString(paper?.id) ||
      url ||
      asOptionalString(paper?.title) ||
      "UNKNOWN_EXTERNAL_ID";
    return {
      external_id,
      title: asOptionalString(paper?.title) || "",
      url,
      status: "EXTERNAL_RETRIEVED_PENDING",
      metadata: {
        provider: "Consensus",
        provider_endpoint: CONSENSUS_ENDPOINT,
        journal_name: asOptionalString(paper?.journal_name) || asOptionalString(paper?.journal) || "",
        publish_year: paper?.publish_year ?? paper?.year ?? null,
        takeaway: asOptionalString(paper?.takeaway) || "",
        abstract: asOptionalString(paper?.abstract) || "",
        doi: doi || "",
      },
    };
  });

  return {
    source: "CONSENSUS",
    source_name: "Consensus",
    query,
    status: "EXTERNAL_RETRIEVED_PENDING",
    evidences,
  };
}

/** Primary path for Vercel: direct HTTPS to Consensus (no local Python spawn). */
async function runConsensusHttp(query: string): Promise<BridgeResponse> {
  const apiKey = process.env.CONSENSUS_API_KEY;
  if (!apiKey) {
    return { status: "UNAVAILABLE" };
  }

  const params = new URLSearchParams({
    query,
    page: "0",
    page_size: "3",
    include_semantic_score: "true",
  });
  const url = `${CONSENSUS_ENDPOINT}?${params.toString()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      signal: controller.signal,
    });
    if (!response.ok) {
      return { status: "UNAVAILABLE", error: `HTTP_${response.status}` };
    }
    const payload = await response.json();
    return normalizeConsensusHttp(query, payload);
  } catch {
    return { status: "UNAVAILABLE" };
  } finally {
    clearTimeout(timer);
  }
}

/** Optional laptop path: Python bridge_cli.py when paths are configured. */
async function runConsensusSpawn(query: string): Promise<BridgeResponse> {
  const ragRepo = process.env.WAIPL_RAG_REPO_PATH;
  const bridgeScript = process.env.CONSENSUS_RAG_BRIDGE_SCRIPT;
  const pythonCommand = process.env.CONSENSUS_PYTHON_COMMAND || "python";
  if (!ragRepo || !bridgeScript) {
    return { status: "UNAVAILABLE" };
  }

  const payload = JSON.stringify({
    query,
    domain: "medical_scientific",
    page_size: 3,
  });

  try {
    const stdout = await runProcess(pythonCommand, [bridgeScript, "--rag-repo", ragRepo], payload);
    return JSON.parse(stdout.trim()) as BridgeResponse;
  } catch {
    return { status: "UNAVAILABLE" };
  }
}

function makeBridgeRunner(): BridgeRunner {
  return async (query: string) => {
    // Prefer HTTPS (works on Vercel). Fall back to local Python spawn if configured.
    if (process.env.CONSENSUS_API_KEY) {
      const httpResult = await runConsensusHttp(query);
      if (httpResult.status !== "UNAVAILABLE") return httpResult;
      // If HTTP failed but spawn is configured, try spawn once.
      if (process.env.CONSENSUS_RAG_BRIDGE_SCRIPT && process.env.WAIPL_RAG_REPO_PATH) {
        return runConsensusSpawn(query);
      }
      return httpResult;
    }
    return runConsensusSpawn(query);
  };
}

export async function getRagQueryContext(
  query: string,
  runBridge: BridgeRunner = makeBridgeRunner()
): Promise<RagQueryContextResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return { text: "", status: "NO_SUFFICIENT_EVIDENCE" };
  }

  try {
    const result = await runBridge(normalizedQuery);
    const text = buildContext(result);
    return {
      text,
      status: text ? "EXTERNAL_RETRIEVED_PENDING" : "NO_SUFFICIENT_EVIDENCE",
    };
  } catch {
    return { text: "", status: "UNAVAILABLE" };
  }
}

export { buildContext, normalizeConsensusHttp, runConsensusHttp };
