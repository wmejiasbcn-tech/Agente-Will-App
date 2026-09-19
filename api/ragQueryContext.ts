import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

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

function makeBridgeRunner(): BridgeRunner {
  return async (query: string) => {
    const apiKey = process.env.CONSENSUS_API_KEY;
    const ragRepo = process.env.WAIPL_RAG_REPO_PATH;
    const bridgeScript = process.env.CONSENSUS_RAG_BRIDGE_SCRIPT;
    const pythonCommand = process.env.CONSENSUS_PYTHON_COMMAND || "python";

    if (!apiKey || !ragRepo || !bridgeScript) {
      return { status: "UNAVAILABLE" };
    }

    const payload = JSON.stringify({
      query,
      domain: "medical_scientific",
      page_size: 3,
    });

    try {
      const { stdout } = await execFileAsync(
        pythonCommand,
        [bridgeScript, "--rag-repo", ragRepo],
        {
          input: payload,
          env: process.env,
          timeout: 20_000,
          maxBuffer: 512 * 1024,
          windowsHide: true,
        } as Parameters<typeof execFileAsync>[2]
      );
      return JSON.parse(stdout.trim()) as BridgeResponse;
    } catch {
      return { status: "UNAVAILABLE" };
    }
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

export { buildContext };
