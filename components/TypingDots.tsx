export function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1.5 px-1 py-2.5" aria-label="Processando">
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-sm bg-leroy [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-sm bg-leroy [animation-delay:180ms]" />
      <span className="h-1.5 w-1.5 animate-pulse-dot rounded-sm bg-leroy [animation-delay:360ms]" />
    </div>
  );
}
