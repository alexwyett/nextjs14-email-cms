import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        maxsite: {
          raw: `only screen and (max-width: 1152px)`
        }
      },
      colors: {
        nbadark: '#1f4a88',
        nbalight: '#2d6cc6',
      },
      fontFamily: {
        inter: ['var(--font-inter)']
      },
      spacing: {
        site: '72rem'
      }
    },
  },
  plugins: [],
};
export default config;
