/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1.5rem', screens: { '2xl': '1280px' } },
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: {
        'fade-up':   { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer:     { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        'pulse-dot': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.3' } },
      },
      animation: {
        'fade-up':    'fade-up 0.45s ease both',
        'fade-up-1':  'fade-up 0.45s 0.08s ease both',
        'fade-up-2':  'fade-up 0.45s 0.16s ease both',
        'fade-up-3':  'fade-up 0.45s 0.24s ease both',
        'fade-in':    'fade-in 0.3s ease both',
        shimmer:      'shimmer 2s linear infinite',
        'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
