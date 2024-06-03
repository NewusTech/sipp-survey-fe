/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      "5xs": "360px",
      xss: "375px",
      xxs: "390px",
      "2xs": "412px",
      xs: "428px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        custom:
          "0 4px 6px rgba(50, 50, 93, 0.9), 0 1px 3px rgba(0, 0, 0, 0.08)",
      },
      colors: {
        biru: "#354777",
        "biru-2": "#1c2c53",
        kuning: "#FFD761",
        pink: "#F18181",
        "pink-2": "#ba5a5a",
        abu: "#7C87A6",
        "abu-2": "#EEF2FF",
        "abu-3": "#AEAEAE",
        "abu-4": "#808080",
        rigit: "#D9C32F",
        "rigit-2": "#9e8e0f",
        lapen: "#F3AB00",
        "lapen-2": "#bc8600",
        agregat: "#00E2AC",
        "agregat-2": "#00b78b",
        onderlag: "#FF7878",
        "onderlag-2": "#dc5151",
        tanah: "#B58500",
        "tanah-2": "#926b00",
        baik: "#78FF81",
        "baik-2": "#2fc03a",
        sedang: "#F2FF78",
        "sedang-2": "#ecf855",
        "rusak-1": "#FFD778",
        "rusak-1-1": "#daaf43",
        "rusak-2": "#FF7878",
        "rusak-2-1": "#d14f4f",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
};
