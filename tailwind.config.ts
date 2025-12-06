import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		// Typography styles moved to src/styles/typography.css to reduce CSS generation complexity
  		// This fixes CSS syntax error: static/css/b7aa00f4355bd230.css:5160:1: Unexpected }
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					'--tw-prose-body': '#374151',
  					'--tw-prose-headings': '#111827',
  					'--tw-prose-lead': '#4b5563',
  					'--tw-prose-links': '#db2777',
  					'--tw-prose-bold': '#111827',
  					'--tw-prose-counters': '#6b7280',
  					'--tw-prose-bullets': '#f472b6',
  					'--tw-prose-hr': '#e5e7eb',
  					'--tw-prose-quotes': '#111827',
  					'--tw-prose-quote-borders': '#f472b6',
  					'--tw-prose-captions': '#374151',
  					'--tw-prose-code': '#db2777',
  					'--tw-prose-pre-code': '#f9fafb',
  					'--tw-prose-pre-bg': '#1f2937',
  					'--tw-prose-th-borders': '#fce7f3',
  					'--tw-prose-td-borders': '#fce7f3',
  					// Typography CSS rules moved to src/styles/typography.css
  					// This reduces CSS generation complexity and fixes CSS syntax error
  				}
  			}
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			pink: {
  				'50': 'var(--pink-50)',
  				'100': 'var(--pink-100)',
  				'200': 'var(--pink-200)',
  				'300': 'var(--pink-300)',
  				'400': 'var(--pink-400)',
  				'500': 'var(--pink-500)',
  				'600': 'var(--pink-600)',
  				'700': 'var(--pink-700)'
  			},
  			cream: {
  				'50': 'var(--cream-50)',
  				'100': 'var(--cream-100)',
  				'200': 'var(--cream-200)',
  				'300': 'var(--cream-300)'
  			},
  			brown: {
  				'100': 'var(--brown-100)',
  				'200': 'var(--brown-200)',
  				'300': 'var(--brown-300)',
  				'600': 'var(--brown-600)',
  				'700': 'var(--brown-700)',
  				'900': 'var(--brown-900)'
  			},
  			green: {
  				'50': 'var(--green-50)',
  				'500': 'var(--green-500)',
  				'600': 'var(--green-600)'
  			},
  			yellow: {
  				'50': 'var(--yellow-50)',
  				'500': 'var(--yellow-500)',
  				'600': 'var(--yellow-600)'
  			},
  			red: {
  				'50': 'var(--red-50)',
  				'500': 'var(--red-500)',
  				'600': 'var(--red-600)'
  			},
  			gray: {
  				'50': 'var(--gray-50)',
  				'100': 'var(--gray-100)',
  				'200': 'var(--gray-200)',
  				'300': 'var(--gray-300)',
  				'400': 'var(--gray-400)',
  				'500': 'var(--gray-500)',
  				'600': 'var(--gray-600)',
  				'700': 'var(--gray-700)',
  				'800': 'var(--gray-800)',
  				'900': 'var(--gray-900)'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)'
  			],
  			display: [
  				'var(--font-display)'
  			]
  		},
  		fontSize: {
  			xs: [
  				'var(--text-xs)',
  				{
  					lineHeight: 'var(--leading-normal)'
  				}
  			],
  			sm: [
  				'var(--text-sm)',
  				{
  					lineHeight: 'var(--leading-normal)'
  				}
  			],
  			base: [
  				'var(--text-base)',
  				{
  					lineHeight: 'var(--leading-normal)'
  				}
  			],
  			lg: [
  				'var(--text-lg)',
  				{
  					lineHeight: 'var(--leading-relaxed)'
  				}
  			],
  			xl: [
  				'var(--text-xl)',
  				{
  					lineHeight: 'var(--leading-relaxed)'
  				}
  			],
  			'2xl': [
  				'var(--text-2xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			],
  			'3xl': [
  				'var(--text-3xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			],
  			'4xl': [
  				'var(--text-4xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			],
  			'5xl': [
  				'var(--text-5xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			],
  			'6xl': [
  				'var(--text-6xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			],
  			'7xl': [
  				'var(--text-7xl)',
  				{
  					lineHeight: 'var(--leading-tight)'
  				}
  			]
  		},
  		spacing: {
  			'section-mobile': 'var(--section-padding-mobile)',
  			'section-tablet': 'var(--section-padding-tablet)',
  			'section-desktop': 'var(--section-padding-desktop)'
  		},
  		borderRadius: {
  			DEFAULT: 'var(--radius-md)',
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: 'var(--radius-xl)',
  			'2xl': 'var(--radius-2xl)',
  			full: 'var(--radius-full)'
  		},
  		boxShadow: {
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		maxWidth: {
  			'container-narrow': 'var(--container-narrow)',
  			'container-standard': 'var(--container-standard)',
  			'container-wide': 'var(--container-wide)'
  		}
  	}
  },
  plugins: [
    require('tailwindcss-animate'),
    typography,
  ],
};

export default config;
