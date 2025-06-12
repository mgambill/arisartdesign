import typographyPlugin from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'
import  colors from 'tailwindcss/colors'
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
				serif: ['Cinzel', ...defaultTheme.fontFamily.serif],
			},
			colors: {
				banner: '#dcc295',
				primary: {
					dark:  colors.amber[500],
					DEFAULT: colors.amber[400],
					light: colors.amber[300],
				}
			}
		},
	},
	plugins: [
		typographyPlugin
	],
}
