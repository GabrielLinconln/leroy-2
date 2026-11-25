import { NextResponse } from "next/server";
import { computeAnalyticsSummary, SEED_EVENTS, SEED_TICKETS } from "@/lib/telemetry";
import { AnalyticsEvent } from "@/lib/types";

// Coletor em memória no servidor (complementado por persistência local no cliente)
let serverEvents: AnalyticsEvent[] = [...SEED_EVENTS];

export async function GET() {
  const summary = computeAnalyticsSummary(serverEvents, SEED_TICKETS);
  return NextResponse.json({
    count: serverEvents.length,
    summary,
    events: serverEvents.slice(0, 60),
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyticsEvent;
    if (!body?.type || !body?.label) {
      return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
    }
    const event: AnalyticsEvent = {
      id: body.id || `ev-${Date.now().toString(36)}`,
      type: body.type,
      storeId: body.storeId || "es-vitoria",
      timestamp: body.timestamp || Date.now(),
      label: body.label,
      aisle: body.aisle,
      painTopic: body.painTopic,
      productName: body.productName,
      durationSec: body.durationSec,
    };
    serverEvents = [event, ...serverEvents.filter((e) => e.id !== event.id)].slice(0, 200);
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
}
