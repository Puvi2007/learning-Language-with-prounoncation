/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--bg)",
        foreground: "var(--text)",
        surface: "var(--surface)",
        'surface-solid': "var(--surface-solid)",
        'text-muted': "var(--text-muted)",
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: '#1cb0f6',
          light: '#4cc3f8',
          dark: '#168ec6',
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: '#ffc800',
          light: '#ffd94c',
          dark: '#cca000',
          foreground: "hsl(var(--accent-foreground))",
        },
        danger: {
          DEFAULT: '#ff4b4b',
          light: '#ff7c7c',
          dark: '#cc3c3c',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--text-muted)",
          foreground: "var(--text-muted)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "var(--surface-solid)",
          foreground: "var(--text)",
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
