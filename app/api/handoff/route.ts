import { NextResponse } from "next/server";
import { SEED_TICKETS } from "@/lib/telemetry";
import { HandoffTicket, HandoffTicketStatus } from "@/lib/types";

let serverTickets: HandoffTicket[] = [...SEED_TICKETS];

export async function GET() {
  return NextResponse.json({ tickets: serverTickets });
}

export async function POST(req: Request) {
  try {
    const ticket = (await req.json()) as HandoffTicket;
    if (!ticket?.id || !ticket?.customerPain) {
      return NextResponse.json({ error: "Ticket inválido" }, { status: 400 });
    }
    serverTickets = [ticket, ...serverTickets.filter((t) => t.id !== ticket.id)].slice(0, 50);
    return NextResponse.json({ ok: true, ticket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as { id?: string; status?: HandoffTicketStatus };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "id e status são obrigatórios" }, { status: 400 });
    }
    serverTickets = serverTickets.map((t) =>
      t.id === body.id ? { ...t, status: body.status! } : t
    );
    return NextResponse.json({ ok: true, tickets: serverTickets });
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
}
