import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oshi: {
          sky: "#EAF6FF",
          cloud: "#FFFFFF",
          main: "#4A90E2",
          sub: "#A0CFFF",
          accent: "#FFD6E8",
        },
      },
      borderRadius: {
        cloud: "24px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;