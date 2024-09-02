import type { Config } from "tailwindcss";
import daisyui from "daisyui"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        button: "hsl(var(--button))",
        input: "hsl(var(--input))",
        card: "hsl(var(--card))",
      },
    }
  },
  plugins: [daisyui],
};
export default config;
