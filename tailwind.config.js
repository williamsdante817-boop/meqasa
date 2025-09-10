/** @type {import('tailwindcss').Config} */
// import {type config} from 'tailwindcss/types/config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "hsl(var(--brand-primary))",
          "primary-dark": "hsl(var(--brand-primary-dark))",
          "primary-light": "hsl(var(--brand-primary-light))",
          secondary: "hsl(var(--brand-secondary))",
          "secondary-light": "hsl(var(--brand-secondary-light))",
          "secondary-dark": "hsl(var(--brand-secondary-dark))",
          accent: "hsl(var(--brand-accent))",
          gray: "hsl(var(--brand-gray))",
          blue: "hsl(var(--brand-blue))",
          "blue-light": "hsl(var(--brand-blue-light))",
          "blue-dark": "hsl(var(--brand-blue-dark))",
          muted: "hsl(var(--brand-muted))",
          "muted-dark": "hsl(var(--brand-muted-dark))",
          border: "hsl(var(--brand-border))",
          "border-light": "hsl(var(--brand-border-light))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        elegant: "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
        "elegant-sm": "0 10px 30px -5px rgba(0, 0, 0, 0.105)",
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        scroll: { to: { transform: "translateX(-50%)" } },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        marquee: "marquee var(--duration, 50s) linear infinite",
        scroll:
          "scroll var(--animation-duration, 60s) var(--animation-direction, forwards) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s linear infinite",
      },
    },
  },
};
