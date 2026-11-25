import { NextResponse } from "next/server";
import { INITIAL_CONTEXT, processCopilotMessage } from "@/lib/copilotEngine";
import { DEFAULT_STORE_ID } from "@/lib/stores";
import { ChatContext } from "@/lib/types";

type ChatRequestBody = {
  message?: string;
  context?: ChatContext;
  storeId?: string;
};

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
  }

  const baseCtx: ChatContext = body.context ?? {
    ...INITIAL_CONTEXT,
    storeId: body.storeId || DEFAULT_STORE_ID,
  };
  if (body.storeId) {
    baseCtx.storeId = body.storeId;
  }

  const result = processCopilotMessage(message, baseCtx);

  // Pequena latência para feedback natural de raciocínio do assistente
  await new Promise((r) => setTimeout(r, 380));

  return NextResponse.json({
    response: result.response,
    context: result.newContext,
    painTopic: result.painTopic,
    engine: "lm-copiloto-local-semantic-v2",
  });
}
