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
  		typography: {
  			DEFAULT: {
  				css: {
  					fontSize: '1.0625rem',
  					lineHeight: '1.75',
  					color: '#374151',
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
  					p: {
  						marginTop: '0',
  						marginBottom: '1.5em',
  						fontSize: '1.0625rem',
  						lineHeight: '1.75',
  						color: '#374151',
  						'@media (max-width: 768px)': {
  							fontSize: '1rem'
  						}
  					},
  					'p:first-child': {
  						marginTop: '0',
  						fontSize: '1.25rem',
  						fontWeight: '500',
  						color: '#1f2937',
  						lineHeight: '1.8',
  						'@media (max-width: 768px)': {
  							fontSize: '1.125rem'
  						}
  					},
  					h1: {
  						fontSize: '2.5em',
  						fontWeight: '700',
  						color: '#111827',
  						marginTop: '2em',
  						marginBottom: '1em',
  						lineHeight: '1.2'
  					},
  					h2: {
  						fontSize: '2.5rem',
  						fontWeight: '700',
  						color: '#111827',
  						marginTop: '3rem',
  						marginBottom: '1.5rem',
  						lineHeight: '1.2',
  						paddingBottom: '0.75rem',
  						borderBottom: '2px solid #fce7f3',
  						'@media (max-width: 768px)': {
  							fontSize: '2.25rem',
  							marginTop: '2.5rem'
  						}
  					},
  					h3: {
  						fontSize: '1.875rem',
  						fontWeight: '600',
  						color: '#1f2937',
  						marginTop: '2.5rem',
  						marginBottom: '1rem',
  						lineHeight: '1.3',
  						paddingLeft: '1rem',
  						paddingTop: '0.5rem',
  						paddingBottom: '0.5rem',
  						borderLeft: '4px solid #f9a8d4',
  						backgroundColor: '#fdf2f8',
  						borderRadius: '0.5rem',
  						'@media (max-width: 768px)': {
  							fontSize: '1.625rem',
  							marginTop: '2rem'
  						}
  					},
  					h4: {
  						fontSize: '1.375rem',
  						fontWeight: '600',
  						color: '#4b5563',
  						marginTop: '2rem',
  						marginBottom: '0.75rem',
  						lineHeight: '1.4',
  						'@media (max-width: 768px)': {
  							fontSize: '1.25rem'
  						}
  					},
  					a: {
  						color: '#db2777',
  						fontWeight: '600',
  						textDecoration: 'none',
  						borderBottom: '2px dashed #f472b6',
  						backgroundColor: 'rgba(252, 231, 243, 0.3)',
  						padding: '2px 4px',
  						borderRadius: '4px',
  						transition: 'all 0.2s ease',
  						'&:hover': {
  							borderBottom: '2px solid #db2777',
  							backgroundColor: 'rgba(252, 231, 243, 0.6)',
  							textDecoration: 'none',
  							transform: 'scale(1.02)'
  						},
  						'&:focus': {
  							outline: '2px solid #ec4899',
  							outlineOffset: '2px',
  							backgroundColor: '#fce7f3'
  						}
  					},
  					img: {
  						borderRadius: '1.5rem',
  						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  						marginTop: '2.5rem',
  						marginBottom: '2.5rem',
  						width: '100%',
  						height: 'auto',
  						border: '2px solid #fce7f3',
  						transition: 'all 0.3s ease',
  						'&:hover': {
  							boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  							borderColor: '#f9a8d4'
  						}
  					},
  					blockquote: {
  						borderLeft: '4px solid #f472b6',
  						backgroundColor: 'transparent',
  						backgroundImage: 'linear-gradient(to right, #fdf2f8, #ffffff)',
  						paddingTop: '1.5rem',
  						paddingBottom: '1.5rem',
  						paddingLeft: '2rem',
  						paddingRight: '1.5rem',
  						marginTop: '2rem',
  						marginBottom: '2rem',
  						borderRadius: '0 0.75rem 0.75rem 0',
  						fontStyle: 'italic',
  						fontSize: '1.125rem',
  						color: '#1f2937',
  						fontWeight: '500',
  						position: 'relative',
  						'&::before': {
  							content: '❝"',
  							fontSize: '3rem',
  							color: '#f472b6',
  							position: 'absolute',
  							left: '0.5rem',
  							top: '0.25rem',
  							lineHeight: '1',
  							opacity: '0.5'
  						}
  					},
  					table: {
  						width: '100%',
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem',
  						borderCollapse: 'collapse',
  						borderRadius: '1rem',
  						overflow: 'hidden',
  						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  						border: '1px solid #fbcfe8'
  					},
  					thead: {
  						backgroundColor: 'transparent',
  						backgroundImage: 'linear-gradient(to bottom, #fdf2f8, #fce7f3)'
  					},
  					th: {
  						backgroundColor: 'transparent',
  						color: '#111827',
  						fontWeight: '600',
  						padding: '1rem 1.25rem',
  						textAlign: 'left',
  						borderBottom: '2px solid #f9a8d4',
  						borderRight: '1px solid #fce7f3',
  						'&:last-child': {
  							borderRight: 'none'
  						}
  					},
  					td: {
  						padding: '0.875rem 1.25rem',
  						border: '1px solid #fce7f3',
  						backgroundColor: '#ffffff',
  						'&:nth-child(odd)': {
  							backgroundColor: 'rgba(253, 242, 248, 0.3)'
  						}
  					},
  					'tbody tr:hover': {
  						backgroundColor: '#fdf2f8'
  					},
  					ul: {
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem',
  						paddingLeft: '1.5rem',
  						listStyleType: 'disc',
  						'& li': {
  							marginTop: '0.5rem',
  							marginBottom: '0.5rem',
  							paddingLeft: '0.5rem',
  							lineHeight: '1.75',
  							'&::marker': {
  								color: '#f472b6'
  							}
  						}
  					},
  					ol: {
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem',
  						paddingLeft: '1.5rem',
  						'& li': {
  							marginTop: '0.5rem',
  							marginBottom: '0.5rem',
  							paddingLeft: '0.5rem',
  							lineHeight: '1.75',
  							'&::marker': {
  								color: '#db2777',
  								fontWeight: '600'
  							}
  						}
  					},
  					code: {
  						color: '#db2777',
  						backgroundColor: '#fdf2f8',
  						padding: '0.125rem 0.375rem',
  						borderRadius: '0.25rem',
  						fontSize: '0.875rem',
  						fontWeight: '400',
  						fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  					},
  					pre: {
  						backgroundColor: '#1f2937',
  						color: '#f9fafb',
  						borderRadius: '0.75rem',
  						padding: '1.5rem',
  						marginTop: '1.5rem',
  						marginBottom: '1.5rem',
  						overflowX: 'auto',
  						'& code': {
  							backgroundColor: 'transparent',
  							color: 'inherit',
  							padding: '0',
  							fontSize: '0.875rem'
  						}
  					},
  					hr: {
  						borderColor: '#e5e7eb',
  						marginTop: '2.5rem',
  						marginBottom: '2.5rem'
  					},
  					strong: {
  						color: '#111827',
  						fontWeight: '700'
  					},
  					em: {
  						color: '#374151',
  						fontStyle: 'italic'
  					}
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
