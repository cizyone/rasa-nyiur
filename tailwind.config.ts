import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#24583F',
          50: '#EBF3EE',
          100: '#D7E8DC',
          200: '#AECFBA',
          300: '#86B698',
          400: '#5D9D76',
          500: '#24583F',
          600: '#1E4A35',
          700: '#183C2B',
          800: '#122E21',
          900: '#0C2017',
        },
        secondary: {
          DEFAULT: '#6F9B55',
          50: '#F0F5EC',
          100: '#E1EBD9',
          200: '#C3D7B3',
          300: '#A5C38D',
          400: '#87AF67',
          500: '#6F9B55',
          600: '#5D8347',
          700: '#4B6B39',
          800: '#39532B',
          900: '#273B1D',
        },
        tertiary: {
          DEFAULT: '#F2B84B',
          50: '#FEF8EC',
          100: '#FDF1D9',
          200: '#FAE2B3',
          300: '#F7D38D',
          400: '#F5C467',
          500: '#F2B84B',
          600: '#EFA31C',
          700: '#C3840F',
          800: '#8D5F0B',
          900: '#573A07',
        },
        neutral: {
          DEFAULT: '#757874',
          50: '#F4F5F4',
          100: '#E9EAE9',
          200: '#D3D5D3',
          300: '#BEC0BE',
          400: '#A8ABA8',
          500: '#757874',
          600: '#5E615E',
          700: '#474948',
          800: '#303131',
          900: '#191A1A',
        },
        bg: {
          DEFAULT: '#F5F6F5',
          card: '#FFFFFF',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12)',
        floating: '0 -4px 24px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
