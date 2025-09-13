import type { Config } from 'tailwindcss'

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: 'var(--primary-font)',
        secondary: 'var(--secondary-font)'
      },
      colors: {
        black: {
          100: '#1E2428',
          200: '#42474C',
          300: '#616262'
        },
        grey: {
          200: '#edeff1',
          300: '#e8f0fe',
          400: '#e5e7eb'
        },
        blue: {
          100: '#2a93c9',
          200: '#56b0cf',
          300: '#0674d1',
          400: '#89e3ff',
          500: '#6cc8df',
          600: '#56b0d2'
        },
        purple: {
          100: '#7b56bd'
        },
        red: {
          100: '#e74c3c'
        },
        green: {
          100: '#11a762'
        }
      },
      boxShadow: {
        'doctor-card': '5px 5px 50px 0px rgba(6, 30, 52, 0.11)',
        'custom-right': '4px 0 8px -4px rgba(100, 114, 125, 0.18)'
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px'
      }
    }
  }
}
export default config
