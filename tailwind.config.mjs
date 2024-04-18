import typographyPlugin from '@tailwindcss/typography'
import defaultTheme from 'tailwindcss/defaultTheme'
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
		},
	},
	plugins: [
		typographyPlugin
	],
}
