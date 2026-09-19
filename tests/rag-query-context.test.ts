import assert from "node:assert/strict";
import { getRagQueryContext, normalizeConsensusHttp } from "../api/ragQueryContext";

const evidence = {
  external_id: "10.1234/example",
  title: "External evidence title",
  url: "https://example.test/paper",
  metadata: {
    journal_name: "Example Journal",
    publish_year: 2026,
    abstract: "Abstract used as bounded external context.",
  },
};

const withKey = await getRagQueryContext("HIV PrEP adherence", async (query) => {
  assert.equal(query, "HIV PrEP adherence");
  return {
    source: "CONSENSUS",
    status: "EXTERNAL_RETRIEVED_PENDING",
    evidences: [evidence],
  };
});

assert.equal(withKey.status, "EXTERNAL_RETRIEVED_PENDING");
assert.match(withKey.text, /CONTEXTO EXTERNO/);
assert.match(withKey.text, /External evidence title/);
assert.match(withKey.text, /EXTERNAL_RETRIEVED_PENDING/);

const failOpen = await getRagQueryContext("HIV PrEP adherence", async () => {
  throw new Error("bridge unavailable");
});

assert.equal(failOpen.status, "UNAVAILABLE");
assert.equal(failOpen.text, "");

const empty = await getRagQueryContext("", async () => {
  throw new Error("runner must not be called");
});

assert.equal(empty.status, "NO_SUFFICIENT_EVIDENCE");
assert.equal(empty.text, "");

const normalized = normalizeConsensusHttp("q", {
  results: [
    {
      title: "Paper A",
      url: "https://example.test/a",
      doi: "10.1/a",
      journal_name: "J",
      publish_year: 2024,
      abstract: "Abs",
      takeaway: "Take",
    },
  ],
});
assert.equal(normalized.source, "CONSENSUS");
assert.equal(normalized.evidences?.[0]?.title, "Paper A");
assert.equal(normalized.evidences?.[0]?.metadata?.takeaway, "Take");

console.log("RAG_QUERY_CONTEXT_TEST_PASS");
