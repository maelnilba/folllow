/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "bg-linear": "bg-linear 15s ease infinite",
      },
      keyframes: {
        "bg-linear": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
          // "0%, 100%": { transform: "rotate(-3deg)" },
          // "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    darkTheme: "light",
  },
};
