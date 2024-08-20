import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#006aff",

          secondary: "#00dcff",

          accent: "#00b7ff",

          neutral: "#212a32",

          "base-100": "#2e2c37",

          info: "#008cb9",

          success: "#00c181",

          warning: "#ffb100",

          error: "#ff0f59",
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
