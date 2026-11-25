import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superfícies industriais de loja física (concreto claro + branco técnico)
        floor: {
          DEFAULT: "#F3F4F6",
          deep: "#E8EAEE",
        },
        // Placas aéreas de sinalização Leroy Merlin
        signage: {
          DEFAULT: "#111315",
          soft: "#1E2226",
          muted: "#4B525B",
          subtle: "#707882",
        },
        // Divisórias técnicas 1px
        rule: {
          DEFAULT: "#D8DCE2",
          strong: "#B8BFC9",
        },
        // Verde oficial Leroy Merlin
        leroy: {
          DEFAULT: "#78BE20",
          dark: "#5A9613",
          deep: "#3B6609",
          soft: "#ECF7DF",
          glow: "#92DE34",
        },
        // Etiqueta eletrônica E-Ink (ESL)
        eink: {
          DEFAULT: "#EAECE6",
          ink: "#1A1D19",
          border: "#C5C9BF",
        },
        // Alertas técnicos de obra / compatibilidade
        amberwarn: {
          DEFAULT: "#B45309",
          bright: "#F59E0B",
          soft: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#B91C1C",
          soft: "#FEE2E2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-dot": "pulseDot 1.3s ease-in-out infinite",
        "esl-blink": "eslBlink 0.75s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave-bar": "waveBar 0.9s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 60%, 100%": { opacity: "0.25", transform: "scale(0.85)" },
          "30%": { opacity: "1", transform: "scale(1)" },
        },
        eslBlink: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 0 rgba(120, 190, 32, 0.85), 0 0 14px 3px rgba(120, 190, 32, 0.75)",
          },
          "50%": {
            opacity: "0.28",
            boxShadow: "0 0 0 6px rgba(120, 190, 32, 0), 0 0 2px 0 rgba(120, 190, 32, 0.2)",
          },
        },
        waveBar: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
