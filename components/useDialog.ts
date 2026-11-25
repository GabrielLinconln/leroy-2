import { useEffect, useRef } from "react";

/** Foco no painel ao abrir, Esc fecha, foco volta para quem abriu. */
// ponytail: sem prender o Tab dentro do modal; trocar por <dialog>.showModal() se precisar
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open]);

  return ref;
}
