/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f3ff',
          100: '#eae7ff',
          200: '#d7d3ff',
          300: '#b9b1ff',
          400: '#9485ff',
          500: '#5B4FDB',
          600: '#4c3fbd',
          700: '#3e339e',
          800: '#332980',
          900: '#2a2065',
        },
        secondary: {
          50: '#f6f5ff',
          100: '#ededff',
          200: '#dddcff',
          300: '#c2bfff',
          400: '#a299ff',
          500: '#8B7FE8',
          600: '#7460d1',
          700: '#624cb8',
          800: '#523d9e',
          900: '#443285',
        },
        accent: {
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffcccc',
          300: '#ffa3a3',
          400: '#ff7272',
          500: '#FF6B6B',
          600: '#e54b4b',
          700: '#d73a3a',
          800: '#b32e2e',
          900: '#942929',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e3e6ea',
          300: '#d4d8dd',
          400: '#b8bfc7',
          500: '#9ca3af',
          600: '#6b7280',
          700: '#4b5563',
          800: '#374151',
          900: '#1f2937',
        },
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#007AFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}