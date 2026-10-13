import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutyellow: "#FFDE59",
        brutpink: "#FF90E8",
        brutcyan: "#7DF9FF",
        brutlime: "#B6F09C",
        brutorange: "#FFB443",
        brutbg: "#FFFDF5",
      },
      boxShadow: {
        brut: "4px 4px 0 #000",
        "brut-sm": "2px 2px 0 #000",
        "brut-lg": "6px 6px 0 #000",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
