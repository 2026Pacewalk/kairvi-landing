import elara from './assets/img/elara.webp'
import aku from './assets/img/aku.webp'
import callisto from './assets/img/callisto.webp'
import callistoGen2 from './assets/img/callisto-gen2.webp'
import aide from './assets/img/aide.webp'
import apollo from './assets/img/apollo.webp'
import castor from './assets/img/castor.webp'
import orian from './assets/img/orian.webp'
import star from './assets/img/star.webp'
import lio from './assets/img/lio.webp'
import astro from './assets/img/astro.webp'
import outdoor from './assets/img/outdoor.webp'
import contact from './assets/img/contact.webp'
import catalogueCover from './assets/img/catalogue-cover.webp'

export const IMAGES = { contact, catalogueCover }

export const BRAND = {
  name: 'Kairvi Lighting',
  tagline: 'Essence of Design & Technology',
  signoff: 'Illuminating Your World.',
  company: 'Shagun Enterprises India',
  address: 'Upper Ground Floor, B-35/938/1-A, Opp. MBD Mall, Ferozepur Road, Ludhiana – 141012',
  phone: '+91 98146 22737',
  phoneRaw: '919814622737',
  whatsapp: '+91 98726 11186',
  whatsappRaw: '919872611186',
  catalogue: '/Kairvi-Lighting-Catalogue-2024-25.pdf',
  catalogueSize: '13.6 MB',
  emails: ['info@kairvilighting.com', 'rajat@kairvilighting.com'],
  web: 'www.kairvilighting.com',
  mapUrl: 'https://maps.google.com/?q=MBD+Mall+Ferozepur+Road+Ludhiana',
}

export const HERO_SLIDES = [
  { img: callistoGen2, name: 'Callisto Gen2', type: 'Trimless Recessed Spot' },
  { img: castor, name: 'Castor', type: 'Adjustable Recessed Spot' },
  { img: star, name: 'Star Series', type: 'Recessed Spot Lights' },
  { img: apollo, name: 'Apollo', type: 'Recessed LED Spot' },
  { img: outdoor, name: 'Outdoor', type: 'Surface & In-ground' },
]

export const CATEGORIES = ['All', 'Recessed', 'Track & Surface', 'Outdoor', 'Systems']

// Figures taken from the 2024–25 catalogue spec tables
export const COLLECTIONS = [
  { id: 'elara', name: 'Elara', cat: 'Recessed', type: 'Recessed LED Spot', img: elara, power: '6 – 13W', optic: '15° – 60°', variants: 14, note: 'Deep anti-glare cup, fixed & tilt versions' },
  { id: 'callisto', name: 'Callisto', cat: 'Recessed', type: 'Recessed LED Spot', img: callisto, power: '7 – 15W', optic: '15° – 60°', variants: 24, note: 'Round & square, fixed or adjustable' },
  { id: 'callisto-gen2', name: 'Callisto Gen2', cat: 'Recessed', type: 'Trimless Recessed Spot', img: callistoGen2, power: '3 – 15W', optic: '8° – 55°', variants: 24, note: 'Plaster-in trimless with swappable reflectors' },
  { id: 'aide', name: 'Aide', cat: 'Recessed', type: 'Multi-head Grille Spot', img: aide, power: '5 – 15W', optic: '20° – 60°', variants: 18, note: 'Single, twin & triple heads for linear runs' },
  { id: 'apollo', name: 'Apollo', cat: 'Recessed', type: 'Recessed LED Spot', img: apollo, power: '7 – 15W', optic: '25° | 50°', variants: 8, note: 'Round & square, deep-set golden reflector' },
  { id: 'castor', name: 'Castor', cat: 'Recessed', type: 'High-power / Zoom Spot', img: castor, power: '10 – 30W', optic: '15° – 36°', variants: 10, note: 'Adjustable & zoom optics for tall ceilings' },
  { id: 'star', name: 'Star Series', cat: 'Recessed', type: 'Recessed Spot Lights', img: star, power: 'Multiple', optic: 'Narrow – Wide', variants: null, note: 'Round & square cylinders in every finish' },
  { id: 'aku', name: 'Aku', cat: 'Recessed', type: 'Micro Dot Spot', img: aku, power: '7W', optic: '15° | 24° | 36°', variants: 4, note: 'Pin-point accents, trimless & pole mount' },
  { id: 'lio', name: 'Lio', cat: 'Track & Surface', type: 'Magnetic Track System', img: lio, power: '6 – 18W', optic: '15° – 60°', variants: null, note: 'Spots, linear grilles & flexible connectors' },
  { id: 'astro', name: 'Astro', cat: 'Track & Surface', type: 'Surface Spot Light', img: astro, power: '3 – 6W', optic: '8° – 40°', variants: null, note: 'Compact track heads & linear projectors' },
  { id: 'orian', name: 'Orian', cat: 'Systems', type: 'Trim & Trimless Mounting Kit', img: orian, power: '1M · 2M · 3M', optic: 'Modular', variants: null, note: 'Plaster-in frames for seamless ceilings' },
  { id: 'outdoor', name: 'Outdoor', cat: 'Outdoor', type: 'In-ground · Wall · Spike', img: outdoor, power: '2 – 5W', optic: '8° – 45°', variants: null, note: 'IP67 stainless in-ground & garden lights' },
]

export const FINISHES = [
  { name: 'White', color: '#f4f2ee', glow: 'rgba(255,250,240,.55)' },
  { name: 'Black', color: '#141414', glow: 'rgba(255,236,200,.35)' },
  { name: 'Dark Chrome', color: 'linear-gradient(135deg,#6b6d72,#2c2d31 60%,#8a8c90)', glow: 'rgba(210,220,235,.4)' },
  { name: 'Chrome', color: 'linear-gradient(135deg,#f3f4f6,#a9adb4 45%,#e7e9ec 70%,#9ba0a8)', glow: 'rgba(230,240,255,.5)' },
  { name: 'Golden', color: 'linear-gradient(135deg,#f6d77a,#b98a2c 50%,#f1cf6b 75%,#9c7222)', glow: 'rgba(255,200,110,.6)' },
]

export const SPECS = [
  { k: 'CRI', v: '>90', d: 'True-to-life colour on skin, stone, fabric & wood.' },
  { k: 'CCT', v: '2700–5000K', d: 'Warm to neutral white, chosen per space.' },
  { k: 'Beam', v: '8°–60°', d: 'Pin-spot to wash — interchangeable optics.' },
  { k: 'IP', v: 'IP20–IP67', d: 'Interior ceilings to wet outdoor ground.' },
]

export const SERVICES = [
  { t: 'Lighting Design', d: 'Layouts, lux levels and beam planning drawn up with your architect or interior designer.' },
  { t: 'Product Selection', d: 'The right fixture, optic, CCT and finish for every room — from 100+ catalogued fixtures.' },
  { t: 'Energy Efficiency', d: 'High-efficacy LED specs that cut running cost without cutting ambience.' },
  { t: 'Compliance & Support', d: 'CE-rated products, clear warranties and transparent pricing for developers and contractors.' },
]
