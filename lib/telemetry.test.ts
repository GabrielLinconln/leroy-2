import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAnalyticsSummary } from "./telemetry";
import type { AnalyticsEvent } from "./types";

const ev = (id: string, type: AnalyticsEvent["type"], extra: Partial<AnalyticsEvent> = {}): AnalyticsEvent => ({
  id, type, storeId: "es-vitoria", timestamp: 0, label: id, ...extra,
});

test("autonomia conta visitas, nao eventos", () => {
  const s = computeAnalyticsSummary(
    [
      ev("1", "chat_message", { sessionId: "a" }),
      ev("2", "list_generated", { sessionId: "a" }),
      ev("3", "chat_message", { sessionId: "b" }),
      ev("4", "handoff_requested", { sessionId: "b" }),
      ev("5", "item_checked", { sessionId: "c" }),
    ],
    []
  );
  assert.equal(s.totalJourneys, 2);
  assert.equal(s.autonomyRate, 50);
});

test("sem dados nao inventa numero", () => {
  const s = computeAnalyticsSummary([], []);
  assert.equal(s.autonomyRate, null);
  assert.equal(s.avgDiagnosisSec, null);
  assert.deepEqual(s.aisleHeatMap, {});
});

test("demanda nao atendida e saude da IA", () => {
  const s = computeAnalyticsSummary(
    [
      ev("1", "chat_message", { engine: "local", unmet: "Cimento" }),
      ev("2", "chat_message", { engine: "gemini", unmet: "cimento" }),
      ev("3", "chat_message", { engine: "gemini" }),
    ],
    []
  );
  assert.deepEqual(s.topUnmet, [{ need: "cimento", count: 2 }]);
  assert.deepEqual(s.aiReplies, { total: 3, local: 1 });
});
