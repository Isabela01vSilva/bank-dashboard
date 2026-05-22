// tailwind.config.js — Design System Bank Interface (Light Theme)
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        /* Core */
        background: '#f9fafb',
        foreground: '#080b12',

        /* Cards & Surfaces */
        card: {
          DEFAULT: '#ffffff',
          foreground: '#080b12',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#080b12',
        },
        surface: {
          DEFAULT: '#f5f7f9',
          foreground: '#292e36',
        },

        /* Brand / Primary (Roxo Fintech) */
        primary: {
          DEFAULT: '#8843db',
          foreground: '#ffffff',
        },

        /* Secondary */
        secondary: {
          DEFAULT: '#f0f2f5',
          foreground: '#363b43',
        },

        /* Muted / Disabled */
        muted: {
          DEFAULT: '#eceff2',
          foreground: '#5d646f',
        },

        /* Accent (igual ao primary neste tema) */
        accent: {
          DEFAULT: '#8843db',
          foreground: '#ffffff',
        },

        /* Destructive / Error */
        destructive: {
          DEFAULT: '#df202e',
          foreground: '#ffffff',
        },

        /* Borders & Inputs */
        border: '#e3e5e8',
        input: '#e9ebef',
        ring: '#8843db',

        /* Fintech Semantic */
        success: {
          DEFAULT: '#008e3e',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#dc8900',
          foreground: '#1c140c',
        },
        income: '#008e3e',
        expense: '#df202e',

        /* Sidebar specific */
        sidebar: {
          DEFAULT: '#ffffff',
          foreground: '#363b43',
          primary: '#8843db',
          'primary-foreground': '#ffffff',
          accent: '#f3f0f8',
          'accent-foreground': '#8843db',
          border: '#e6e8eb',
          ring: '#8843db',
        },

        /* Charts */
        chart: {
          1: '#8843db',
          2: '#008e3e',
          3: '#dc8900',
          4: '#df202e',
          5: '#0075a9',
        },
      },

      /* Typography */
      fontFamily: {
        display: ["'Plus Jakarta Sans'", 'system-ui', 'sans-serif'],
        body: ["'Inter'", 'system-ui', 'sans-serif'],
      },

      /* Border Radius */
      borderRadius: {
        sm: 'calc(0.75rem - 4px)',  // ~8px
        DEFAULT: '0.75rem',           // 12px
        md: 'calc(0.75rem - 2px)',    // ~10px
        lg: '0.75rem',                // 12px
        xl: 'calc(0.75rem + 4px)',    // ~16px
        '2xl': 'calc(0.75rem + 8px)', // ~20px
        '3xl': 'calc(0.75rem + 12px)',// ~24px
        '4xl': 'calc(0.75rem + 16px)',// ~28px
      },
    },
  },
}
