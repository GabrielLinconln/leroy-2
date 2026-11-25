import { NextResponse } from "next/server";
import { INITIAL_CONTEXT, processCopilotMessage } from "@/lib/copilotEngine";
import { processWithLlm, type ChatTurn } from "@/lib/copilotLlm";
import { CHAT_MODEL, isLlmEnabled } from "@/lib/llm";
import { isRateLimited } from "@/lib/rateLimit";
import { DEFAULT_STORE_ID } from "@/lib/stores";
import { ChatContext } from "@/lib/types";

const MAX_MESSAGE = 500;
const MAX_TURNS = 8;

type ChatRequestBody = {
  message?: string;
  context?: ChatContext;
  storeId?: string;
  history?: unknown;
};

function sanitizeTurns(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (t): t is ChatTurn =>
        !!t && (t.role === "user" || t.role === "assistant") && typeof t.text === "string" && t.text.trim() !== ""
    )
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, text: t.text.slice(0, MAX_MESSAGE) }));
}

export async function POST(req: Request) {
  if (isRateLimited(req)) {
    return NextResponse.json({ error: "Muitas mensagens seguidas. Aguarde um minuto." }, { status: 429 });
  }

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
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: `Mensagem acima de ${MAX_MESSAGE} caracteres` }, { status: 400 });
  }

  const baseCtx: ChatContext = body.context ?? {
    ...INITIAL_CONTEXT,
    storeId: body.storeId || DEFAULT_STORE_ID,
  };
  if (body.storeId) {
    baseCtx.storeId = body.storeId;
  }

  if (isLlmEnabled()) {
    try {
      const result = await processWithLlm(message, sanitizeTurns(body.history), baseCtx);
      return NextResponse.json({
        response: result.response,
        context: result.newContext,
        painTopic: result.painTopic,
        engine: CHAT_MODEL,
      });
    } catch (err) {
      // Sem conteudo do cliente no log: so o motivo da falha.
      console.warn("[chat] fallback para motor local:", err instanceof Error ? err.message : err);
    }
  }

  const result = processCopilotMessage(message, baseCtx);
  return NextResponse.json({
    response: result.response,
    context: result.newContext,
    painTopic: result.painTopic,
    engine: "local",
  });
}
