export function AssistantAvatar({ size = 28 }: { size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-md bg-signage"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={Math.round(size * 0.68)}
        height={Math.round(size * 0.56)}
        viewBox="0 0 24 20"
        fill="none"
      >
        <path d="M12 1L23 19H1L12 1Z" fill="#78BE20" />
        <path d="M12 7L17.5 16.5H6.5L12 7Z" fill="#111315" />
      </svg>
    </div>
  );
}
