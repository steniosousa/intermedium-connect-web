/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        tertiary: 'var(--color-bg-tertiary)',
        quaternary: 'var(--color-bg-quaternary)',
        quinary: 'var(--color-text-quinary)',
      },
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        quaternary: 'var(--color-text-quaternary)',
        quinary: 'var(--color-text-quinary)',
      },
      borderColor: {
        primary: 'var(--color-border-primary)',
      },
    },
  },
  plugins: [
    
  ],
}

