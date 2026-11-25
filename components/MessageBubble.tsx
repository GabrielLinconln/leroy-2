import { ChatMessage } from "@/lib/types";
import { AssistantAvatar } from "./AssistantAvatar";
import { MicIcon } from "./Icons";

export function MessageBubble({
  message,
  children,
}: {
  message: ChatMessage;
  children?: React.ReactNode;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full animate-slide-up items-start gap-2.5 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && <AssistantAvatar size={28} />}

      <div
        className={`max-w-[90%] rounded-xl px-4 py-3 text-[13.5px] leading-[1.58] sm:max-w-[82%] ${
          isUser
            ? "rounded-tr-sm bg-signage text-white"
            : "rounded-tl-sm border border-rule bg-white text-signage"
        }`}
      >
        {isUser && message.viaVoice && (
          <div className="mb-1 inline-flex items-center gap-1 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-leroy">
            <MicIcon size={11} />
            Ditada por voz
          </div>
        )}

        {message.userImagePreview && (
          <div className="mb-2.5 overflow-hidden rounded-lg border border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.userImagePreview}
              alt="Foto enviada pelo cliente"
              className="max-h-40 w-full object-cover"
            />
          </div>
        )}
        <p className="whitespace-pre-wrap">{formatBoldText(message.text)}</p>
        {children}
      </div>
    </div>
  );
}

function formatBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
