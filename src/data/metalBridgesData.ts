// Every value in this file is carried over from the original METAL BRIDGES
// site (index.html, projects.html, video-gallery.html). Nothing is dropped.

export type ServiceCategory = 'structure' | 'fabrication' | 'architectural';

export interface SpecRow {
  label: string;
  value: string;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  tagline: string;
  summary: string;
  image: string;
  imageAlt: string;
  scaleLabel: string;
  finishLabel: string;
  leadLabel: string;
  specs: SpecRow[];
  standards: string[];
}

export interface Pillar {
  index: string;
  title: string;
  metric: string;
  note: string;
}

export type ProjectCategory =
  | 'gates'
  | 'doors'
  | 'staircases'
  | 'roofing'
  | 'railings'
  | 'industrial'
  | 'custom';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface DeploymentCase {
  id: string;
  site: string;
  location: string;
  commissioned: string;
  scope: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  metrics: SpecRow[];
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
}

export interface Dispatch {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  video?: string;
  paragraphs: string[];
}

export interface Advantage {
  title: string;
  description: string;
}

export interface BusinessStat {
  value: string;
  suffix: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Business identity                                                   */
/* ------------------------------------------------------------------ */

export const BUSINESS = {
  name: 'METAL BRIDGES',
  shortName: 'METAL BRIDGES',
  mark: 'MB',
  tagline: 'Precision Fabrication',
  founder: 'Kofi Boansi',
  founderTitle: 'Modern Metal Designer',
  phoneDisplay: '0244-044001',
  phoneHref: 'tel:+233244044001',
  whatsapp: 'https://wa.me/233244044001',
  email: 'info@metalbridges.com',
  postalAddress: 'P.O. Box 1288, New-Achimota, Accra',
  workshop: 'Tantra Hill, Between GOIL Filling Station and Rockers, Accra',
  mapsUrl: 'https://maps.google.com/?q=Tantra+Hill+Accra+Ghana',
  hours: [
    { label: 'Mon – Fri', value: '8:00 AM – 6:00 PM' },
    { label: 'Saturday', value: '8:00 AM – 2:00 PM' },
    { label: 'Sunday', value: 'Closed' },
  ],
  description:
    'Premium metal fabrication and welding services in Accra, Ghana. Building strength in steel, crafting excellence since 2014.',
  about:
    'Founded with a vision to revolutionize metal fabrication in Ghana, METAL BRIDGES has grown into one of the most trusted names in the industry. Our state-of-the-art workshop in Tantra Hill, Accra, is equipped with the latest tools and machinery.',
  aboutSecondary:
    'With a deep passion for craftsmanship and innovation, Kofi Boansi leads METAL BRIDGES with an unwavering commitment to precision, quality, and customer satisfaction.',
} as const;

export const HERO_STATS: BusinessStat[] = [
  { value: '150', suffix: '+', label: 'Projects Completed' },
  { value: '12', suffix: '+', label: 'Years Experience' },
  { value: '200', suffix: '+', label: 'Happy Clients' },
  { value: '25', suffix: '+', label: 'Skilled Professionals' },
];

/* ------------------------------------------------------------------ */
/* Imagery (all original assets, reused)                               */
/* ------------------------------------------------------------------ */

export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&h=1080&fit=crop&auto=format&q=80',
  workshop:
    'https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=1200&h=900&fit=crop&auto=format&q=80',
  founder:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&auto=format&q=80',
  gates:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415688/df0c1b84-2f6a-4fa7-8d6f-058c23d6aed8_grzzqx.jpg',
  doors:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415485/8c38782d-01cb-48e4-8391-96951b8b82ae_lwjwy1.jpg',
  staircases:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415489/e8f93370-33b2-49b4-b760-e45e54606837_wijnxb.jpg',
  roofing:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415426/d91381e9-3cd6-4968-8ca1-39f61d063f9c_bv5p4u.jpg',
  railings:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415690/032fa17c-6f98-4dd8-b203-890a4d3562da_lnmcvr.jpg',
  industrial:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415425/6cf81117-81d5-4a5a-9993-e9ff950bee7f_nqhdap.jpg',
  custom:
    'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415423/ce4402e6-c6c0-4ea6-b9e0-ddc21e08634a_dl0hta.jpg',
} as const;

/* ------------------------------------------------------------------ */
/* Services catalogue — all 17 original services                      */
/* ------------------------------------------------------------------ */

const STANDARDS = {
  fabrication: ['AWS D1.1', 'ISO 3834-2', 'BS EN 1090', 'ASTM A36'],
  structure: ['BS EN 1090', 'AWS D1.1', 'ISO 12944', 'ASTM A123'],
  architectural: ['BS EN 1090', 'ISO 12944', 'ASTM A276', 'EN 10088'],
} as const;

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  structure: 'Structure & Security',
  fabrication: 'Fabrication',
  architectural: 'Architectural',
};

type ServiceSeed = Omit<Service, 'categoryLabel' | 'standards' | 'specs'> & {
  specs: [string, string][];
};

const SERVICE_SEEDS: ServiceSeed[] = [
  {
    id: 'metal-fabrication',
    name: 'Metal Fabrication',
    category: 'fabrication',
    tagline: 'Custom structures · built to spec',
    summary:
      'Custom metal structures designed and built to your exact specifications using premium materials and modern techniques.',
    image: IMAGES.industrial,
    imageAlt: 'Fabricated structural steel framework',
    scaleLabel: 'Residential to industrial',
    finishLabel: 'Mild steel / stainless',
    leadLabel: '2–6 weeks',
    specs: [
      ['Primary material', 'Mild steel, stainless, aluminium'],
      ['Fabrication method', 'Cut, formed, welded, finished'],
      ['Tolerance', '±2 mm on assembled frames'],
      ['Finish', 'Primer + topcoat or powder coat'],
      ['Site survey', 'Included before quotation'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'welding-services',
    name: 'Welding Services',
    category: 'fabrication',
    tagline: 'MIG · TIG · Arc',
    summary:
      'Professional welding services including MIG, TIG, and arc welding for all types of metal projects and repairs.',
    image: IMAGES.industrial,
    imageAlt: 'Welder joining structural steel',
    scaleLabel: 'On-site & workshop',
    finishLabel: 'Certified welds',
    leadLabel: '1–3 weeks',
    specs: [
      ['Processes', 'MIG, TIG, arc, spot'],
      ['Materials', 'Steel, stainless, aluminium'],
      ['Joint prep', 'Bevel, clean, jig, clamp'],
      ['Inspection', 'Visual + dimensional check'],
      ['Mobile unit', 'Available across Accra'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'stainless-steel-works',
    name: 'Stainless Steel Works',
    category: 'fabrication',
    tagline: '316 & 304 stainless',
    summary:
      'Elegant stainless steel installations for railings, countertops, and architectural features with lasting finish.',
    image: IMAGES.railings,
    imageAlt: 'Brushed stainless steel railing detail',
    scaleLabel: 'Architectural grade',
    finishLabel: 'Brushed / mirror',
    leadLabel: '2–4 weeks',
    specs: [
      ['Grades', '304 and 316 marine grade'],
      ['Finish', 'Brushed, mirror, satin'],
      ['Fixing', 'Concealed mechanical fixings'],
      ['Fabrication', 'TIG welded, polished seams'],
      ['Maintenance', 'Wipe-clean, rust resistant'],
      ['Warranty', '24 months finish'],
    ],
  },
  {
    id: 'security-doors',
    name: 'Security Doors',
    category: 'structure',
    tagline: 'Reinforced steel leaf',
    summary:
      'Heavy-duty security doors combining robust protection with modern aesthetics for residential and commercial use.',
    image: IMAGES.doors,
    imageAlt: 'Reinforced steel security door',
    scaleLabel: 'Single & double leaf',
    finishLabel: 'Powder-coated',
    leadLabel: '7–14 days',
    specs: [
      ['Leaf construction', 'Reinforced steel frame + infill'],
      ['Locking', 'Multi-point mortice lock'],
      ['Hinges', 'Heavy-duty adjustable barrel'],
      ['Frame', '2 mm formed steel section'],
      ['Finish', 'Powder coat, any RAL colour'],
      ['Warranty', '24 months hardware'],
    ],
  },
  {
    id: 'gates',
    name: 'Gates',
    category: 'structure',
    tagline: 'Sliding · swing · automatic',
    summary:
      'Beautifully crafted gates in modern and classic designs — sliding, swing, and automatic options available.',
    image: IMAGES.gates,
    imageAlt: 'Modern steel sliding gate with geometric patterns',
    scaleLabel: 'Up to 6 m spans',
    finishLabel: 'Matte / gloss',
    leadLabel: '2–4 weeks',
    specs: [
      ['Types', 'Sliding, double swing, rolling'],
      ['Automation', 'Motor + remote optional'],
      ['Frame', '50 × 50 mm box section'],
      ['Infill', 'Bars, laser-cut panels, timber'],
      ['Finish', 'Powder coat or wet spray'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'burglar-proof',
    name: 'Burglar Proof Installation',
    category: 'structure',
    tagline: 'Discreet window grilles',
    summary:
      'Strong and discreet burglar proof windows and grills that provide security without compromising aesthetics.',
    image: IMAGES.doors,
    imageAlt: 'Window security grille installation',
    scaleLabel: 'Full property',
    finishLabel: 'Powder-coated',
    leadLabel: '5–10 days',
    specs: [
      ['Bar spacing', '100–125 mm standard'],
      ['Section', '12 mm square or flat bar'],
      ['Fixing', 'Chemical anchors to masonry'],
      ['Escape hatch', 'Optional hinged panel'],
      ['Finish', 'Powder coat, match façade'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'balustrades-handrails',
    name: 'Balustrades & Handrails',
    category: 'architectural',
    tagline: 'Interior & exterior',
    summary:
      'Stylish and safe balustrades and handrails for staircases, balconies, and terraces in various designs.',
    image: IMAGES.railings,
    imageAlt: 'Stainless steel balcony balustrade',
    scaleLabel: 'Stair, balcony, terrace',
    finishLabel: 'Stainless / mild steel',
    leadLabel: '1–3 weeks',
    specs: [
      ['Height', '1,000–1,100 mm standard'],
      ['Infill', 'Glass, cable, vertical bar'],
      ['Handrail', '42 mm round or flat profile'],
      ['Fixing', 'Base plate or side mount'],
      ['Finish', 'Brushed stainless / powder coat'],
      ['Warranty', '24 months finish'],
    ],
  },
  {
    id: 'roofing-structures',
    name: 'Roofing Structures',
    category: 'structure',
    tagline: 'Structural steel frames',
    summary:
      'Durable steel roofing structures and frames engineered for strength, weather resistance, and longevity.',
    image: IMAGES.roofing,
    imageAlt: 'Large-span steel roofing structure',
    scaleLabel: 'Up to 24 m spans',
    finishLabel: 'Galvanized',
    leadLabel: '3–8 weeks',
    specs: [
      ['Span', 'Up to 24 m clear span'],
      ['Purlin spacing', '900–1,200 mm'],
      ['Coating', 'Hot-dip galvanized frame'],
      ['Roof sheet', 'Aluzinc or long-span deck'],
      ['Bracing', 'Wind and tie bracing included'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'metal-canopies',
    name: 'Metal Canopies',
    category: 'architectural',
    tagline: 'Entrance & walkway',
    summary:
      'Custom-designed canopies for entrances, walkways, and outdoor spaces with modern styling.',
    image: IMAGES.roofing,
    imageAlt: 'Modern steel entrance canopy',
    scaleLabel: 'Custom span',
    finishLabel: 'Powder-coated',
    leadLabel: '2–4 weeks',
    specs: [
      ['Structure', 'Cantilever or post-supported'],
      ['Roof', 'Polycarbonate, glass, or steel'],
      ['Drainage', 'Integrated gutter + downpipe'],
      ['Fixings', 'Anchor to slab or wall'],
      ['Finish', 'Powder coat, any RAL'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'carports',
    name: 'Carports',
    category: 'architectural',
    tagline: 'Weatherproof shelter',
    summary:
      'Weatherproof carport structures designed to protect your vehicles with style and durability.',
    image: IMAGES.roofing,
    imageAlt: 'Steel carport canopy over a driveway',
    scaleLabel: '1–4 vehicles',
    finishLabel: 'Powder-coated',
    leadLabel: '2–4 weeks',
    specs: [
      ['Bays', 'Single, double, or custom'],
      ['Post spacing', 'Per vehicle bay layout'],
      ['Roof', 'Metal deck or polycarbonate'],
      ['Wind load', 'Designed to local exposure'],
      ['Finish', 'Powder coat or galvanized'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'staircase-fabrication',
    name: 'Staircase Fabrication',
    category: 'architectural',
    tagline: 'Spiral · straight · L-shaped',
    summary:
      'Modern and classic staircase designs in steel, including spiral, straight, and L-shaped configurations.',
    image: IMAGES.staircases,
    imageAlt: 'Custom steel spiral staircase',
    scaleLabel: 'Indoor & outdoor',
    finishLabel: 'Steel + glass / timber',
    leadLabel: '3–6 weeks',
    specs: [
      ['Configurations', 'Spiral, straight, L, U'],
      ['Stringer', 'Channel or tubular steel'],
      ['Treads', 'Steel, timber, or glass'],
      ['Rise / going', 'Comfort-checked ergonomics'],
      ['Fixings', 'Site-measured before fabrication'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'window-protectors',
    name: 'Window Protectors',
    category: 'structure',
    tagline: 'Decorative security',
    summary:
      'Decorative and functional window protectors that enhance security while maintaining visual appeal.',
    image: IMAGES.doors,
    imageAlt: 'Decorative window protector grille',
    scaleLabel: 'Per opening',
    finishLabel: 'Powder-coated',
    leadLabel: '5–10 days',
    specs: [
      ['Pattern', 'Bespoke geometric or classic'],
      ['Section', 'Flat bar, square bar, tube'],
      ['Fixing', 'Removable for cleaning'],
      ['Security', 'Through-fixed, tamper resistant'],
      ['Finish', 'Powder coat, any RAL'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'warehouse-structures',
    name: 'Warehouse Structures',
    category: 'structure',
    tagline: 'Heavy-duty frames',
    summary:
      'Industrial-grade warehouse frames, shelving, and structural components built for heavy-duty use.',
    image: IMAGES.industrial,
    imageAlt: 'Warehouse steel frame and storage racking',
    scaleLabel: 'Industrial grade',
    finishLabel: 'Galvanized',
    leadLabel: '4–10 weeks',
    specs: [
      ['Frame', 'Portal or rack-supported'],
      ['Loading', 'Racked and live-load rated'],
      ['Coating', 'Galvanized or epoxy'],
      ['Bracing', 'Longitudinal + cross bracing'],
      ['Erection', 'Crew and plant coordinated'],
      ['Warranty', '24 months structure'],
    ],
  },
  {
    id: 'industrial-fabrication',
    name: 'Industrial Fabrication',
    category: 'fabrication',
    tagline: 'Plant & infrastructure',
    summary:
      'Large-scale industrial metal fabrication for factories, plants, and commercial infrastructure projects.',
    image: IMAGES.industrial,
    imageAlt: 'Industrial plant steel fabrication',
    scaleLabel: 'Large-scale',
    finishLabel: 'Industrial coating',
    leadLabel: '6–12 weeks',
    specs: [
      ['Scope', 'Platforms, frames, tanks, guards'],
      ['Drawing', 'Fabrication drawings supplied'],
      ['Welding', 'Certified procedures on request'],
      ['Coating', 'Epoxy / polyurethane systems'],
      ['QA', 'Dimensional and weld inspection'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'decorative-metal-designs',
    name: 'Decorative Metal Designs',
    category: 'architectural',
    tagline: 'Art & partitions',
    summary:
      'Artistic and decorative metalwork including wall art, room dividers, and ornamental features.',
    image: IMAGES.custom,
    imageAlt: 'Decorative laser-cut metal partition',
    scaleLabel: 'Bespoke',
    finishLabel: 'Mixed metal',
    leadLabel: '2–5 weeks',
    specs: [
      ['Techniques', 'Laser cut, forge, weld, patina'],
      ['Materials', 'Steel, brass, copper, stainless'],
      ['Finish', 'Paint, powder, wax, patina'],
      ['Mounting', 'Wall, floor, or suspended'],
      ['Design', 'Concept sketch before build'],
      ['Warranty', '12 months workmanship'],
    ],
  },
  {
    id: 'metal-repairs-maintenance',
    name: 'Metal Repairs & Maintenance',
    category: 'fabrication',
    tagline: 'Restore & extend',
    summary:
      'Expert repair and maintenance services to restore and extend the life of your metal structures.',
    image: IMAGES.industrial,
    imageAlt: 'Metal structure repair and maintenance',
    scaleLabel: 'Any structure',
    finishLabel: 'Match existing',
    leadLabel: '1–2 weeks',
    specs: [
      ['Assessment', 'On-site condition survey'],
      ['Repairs', 'Weld, straighten, replace sections'],
      ['Corrosion', 'Treat, prime, recoat'],
      ['Hardware', 'Hinges, locks, rollers renewed'],
      ['Scheduling', 'One-off or maintenance plan'],
      ['Warranty', '6 months on repairs'],
    ],
  },
  {
    id: 'custom-metal-projects',
    name: 'Custom Metal Projects',
    category: 'fabrication',
    tagline: 'If you can imagine it',
    summary:
      'Bespoke metal solutions crafted to your unique vision — if you can imagine it, we can build it.',
    image: IMAGES.custom,
    imageAlt: 'Bespoke metal furniture and fixtures',
    scaleLabel: 'One-off',
    finishLabel: 'To brief',
    leadLabel: 'Quoted per scope',
    specs: [
      ['Brief', 'Consultation and site measure'],
      ['Design', 'Sketch, sample, or drawing'],
      ['Prototype', 'Material and finish samples'],
      ['Fabrication', 'In-house workshop build'],
      ['Installation', 'Delivered and fitted'],
      ['Warranty', '12 months workmanship'],
    ],
  },
];

export const SERVICES: Service[] = SERVICE_SEEDS.map((seed) => ({
  ...seed,
  categoryLabel: CATEGORY_LABELS[seed.category],
  specs: seed.specs.map(([label, value]) => ({ label, value })),
  standards: [...STANDARDS[seed.category]],
}));

export const SERVICE_FILTERS: { id: ServiceCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'structure', label: 'Structure & Security' },
  { id: 'fabrication', label: 'Fabrication' },
  { id: 'architectural', label: 'Architectural' },
];

/* ------------------------------------------------------------------ */
/* Mission pillars (yellow act)                                        */
/* ------------------------------------------------------------------ */

export const MISSION_PILLARS: Pillar[] = [
  {
    index: '01',
    title: 'Craft Without Compromise',
    metric: '150+',
    note: 'Projects delivered across residential, commercial, and industrial sectors.',
  },
  {
    index: '02',
    title: 'Built To Outlast',
    metric: '12+',
    note: 'Years of hands-on fabrication experience in Accra since 2014.',
  },
  {
    index: '03',
    title: 'Trusted By Clients',
    metric: '200+',
    note: 'Homeowners, businesses, and site managers across Ghana.',
  },
];

/* ------------------------------------------------------------------ */
/* Field deployments (project case studies)                            */
/* ------------------------------------------------------------------ */

export const DEPLOYMENT_CASES: DeploymentCase[] = [
  {
    id: 'east-legon',
    site: 'East Legon Residence',
    location: 'East Legon, Greater Accra',
    commissioned: 'Delivered Q4 2025',
    scope: 'Residential · Driveway',
    title: 'Modern Sliding Gate',
    summary: 'Elegant steel sliding gate with geometric patterns.',
    image: IMAGES.gates,
    imageAlt: 'Modern steel sliding gate with geometric patterns',
    metrics: [
      { label: 'Gate Span', value: '4.8 m' },
      { label: 'Finish', value: 'Matte Black' },
      { label: 'Build Time', value: '18 days' },
    ],
  },
  {
    id: 'tema',
    site: 'Tema Industrial Facility',
    location: 'Tema, Greater Accra',
    commissioned: 'Delivered Q2 2025',
    scope: 'Industrial · Roofing',
    title: 'Industrial Roofing Structure',
    summary: 'Large-span steel roofing for a warehouse facility.',
    image: IMAGES.roofing,
    imageAlt: 'Large-span steel roofing for a warehouse facility',
    metrics: [
      { label: 'Clear Span', value: '24 m' },
      { label: 'Coverage', value: '1,200 m²' },
      { label: 'Crew', value: '8 fitters' },
    ],
  },
  {
    id: 'osu',
    site: 'Osu Office Building',
    location: 'Osu, Accra',
    commissioned: 'Delivered Q3 2025',
    scope: 'Commercial · Railings',
    title: 'Stainless Steel Balcony Railings',
    summary: 'Premium stainless steel balustrade system.',
    image: IMAGES.railings,
    imageAlt: 'Premium stainless steel balustrade system',
    metrics: [
      { label: 'Total Run', value: '86 m' },
      { label: 'Grade', value: '316 Marine' },
      { label: 'Install', value: '14 days' },
    ],
  },
  {
    id: 'cantonments',
    site: 'Cantonments Residence',
    location: 'Cantonments, Accra',
    commissioned: 'Delivered Q1 2026',
    scope: 'Residential · Security',
    title: 'Heavy-Duty Security Door',
    summary: 'Reinforced steel security door with a modern finish.',
    image: IMAGES.doors,
    imageAlt: 'Reinforced steel security door with a modern finish',
    metrics: [
      { label: 'Leaf Width', value: '1.2 m' },
      { label: 'Finish', value: 'Powder-coated' },
      { label: 'Install', value: '5 days' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Full project portfolio — all 17 original projects                   */
/* ------------------------------------------------------------------ */

export const PROJECTS: Project[] = [
  {
    id: 'modern-sliding-gate',
    title: 'Modern Sliding Gate',
    category: 'gates',
    categoryLabel: 'Gates',
    description: 'Elegant steel sliding gate with geometric patterns.',
    image: IMAGES.gates,
    imageAlt: 'Modern Sliding Gate',
  },
  {
    id: 'ornamental-double-swing-gate',
    title: 'Ornamental Double Swing Gate',
    category: 'gates',
    categoryLabel: 'Gates',
    description: 'Classic double-swing gate with ornamental details.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415689/ea2389ce-f1da-4f45-9771-2491786eff74_bq5hgb.jpg',
    imageAlt: 'Ornamental Double Swing Gate',
  },
  {
    id: 'automatic-rolling-gate',
    title: 'Automatic Rolling Gate',
    category: 'gates',
    categoryLabel: 'Gates',
    description: 'Motorized rolling gate for commercial property.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415486/b5ca7167-0faf-4db1-a2ae-65f0a312defe_c5fvjx.jpg',
    imageAlt: 'Automatic Rolling Gate',
  },
  {
    id: 'heavy-duty-security-door',
    title: 'Heavy-Duty Security Door',
    category: 'doors',
    categoryLabel: 'Doors',
    description: 'Reinforced steel security door with modern finish.',
    image: IMAGES.doors,
    imageAlt: 'Heavy-Duty Security Door',
  },
  {
    id: 'designer-front-door',
    title: 'Designer Front Door',
    category: 'doors',
    categoryLabel: 'Doors',
    description: 'Premium steel entrance door with decorative panels.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415485/e36d926e-901c-4383-a26a-e2206125d05c_q2bree.jpg',
    imageAlt: 'Designer Front Door',
  },
  {
    id: 'custom-spiral-staircase',
    title: 'Custom Spiral Staircase',
    category: 'staircases',
    categoryLabel: 'Staircases',
    description: 'Space-saving spiral staircase with handrails.',
    image: IMAGES.staircases,
    imageAlt: 'Custom Spiral Staircase',
  },
  {
    id: 'modern-l-shaped-staircase',
    title: 'Modern L-Shaped Staircase',
    category: 'staircases',
    categoryLabel: 'Staircases',
    description: 'Contemporary steel staircase with glass railing.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415491/5BD65239-E7E4-42CC-B6FC-F565BFB43DAF_pon9kf.jpg',
    imageAlt: 'Modern L-Shaped Staircase',
  },
  {
    id: 'industrial-roofing-structure',
    title: 'Industrial Roofing Structure',
    category: 'roofing',
    categoryLabel: 'Roofing',
    description: 'Large-span steel roofing for warehouse facility.',
    image: IMAGES.roofing,
    imageAlt: 'Industrial Roofing Structure',
  },
  {
    id: 'residential-carport-roof',
    title: 'Residential Carport Roof',
    category: 'roofing',
    categoryLabel: 'Roofing',
    description: 'Custom steel canopy for residential parking.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415488/4bceed22-161f-49df-9350-8a2d2baff10c_gv9rwy.jpg',
    imageAlt: 'Residential Carport Roof',
  },
  {
    id: 'stainless-steel-balcony-railings',
    title: 'Stainless Steel Balcony Railings',
    category: 'railings',
    categoryLabel: 'Railings',
    description: 'Premium stainless steel balustrade system.',
    image: IMAGES.railings,
    imageAlt: 'Stainless Steel Balcony Railings',
  },
  {
    id: 'decorative-handrails',
    title: 'Decorative Handrails',
    category: 'railings',
    categoryLabel: 'Railings',
    description: 'Custom-designed handrails with artistic patterns.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415690/8ec561bc-b0a1-41ba-bf53-82f0f1d45b3b_j2yu7x.jpg',
    imageAlt: 'Decorative Handrails',
  },
  {
    id: 'commercial-steel-framework',
    title: 'Commercial Steel Framework',
    category: 'industrial',
    categoryLabel: 'Industrial',
    description: 'Heavy-duty structural steel for commercial building.',
    image: IMAGES.industrial,
    imageAlt: 'Commercial Steel Framework',
  },
  {
    id: 'warehouse-storage-racks',
    title: 'Warehouse Storage Racks',
    category: 'industrial',
    categoryLabel: 'Industrial',
    description: 'Heavy-duty industrial storage rack system.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415425/479684e4-da41-45b9-b0c5-f571ebcfb00d_lsli1z.jpg',
    imageAlt: 'Warehouse Storage Racks',
  },
  {
    id: 'decorative-metal-partition',
    title: 'Decorative Metal Partition',
    category: 'custom',
    categoryLabel: 'Custom',
    description: 'Artistic room divider with intricate patterns.',
    image: IMAGES.custom,
    imageAlt: 'Decorative Metal Partition',
  },
  {
    id: 'metal-garden-art',
    title: 'Metal Garden Art',
    category: 'custom',
    categoryLabel: 'Custom',
    description: 'Custom decorative metal sculptures for garden.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415430/E25D7FBA-F8DE-47A6-836C-40821530CBC3_oc7shh.jpg',
    imageAlt: 'Metal Garden Art',
  },
  {
    id: 'custom-metal-furniture',
    title: 'Custom Metal Furniture',
    category: 'custom',
    categoryLabel: 'Custom',
    description: 'Industrial-style metal furniture and fixtures.',
    image:
      'https://res.cloudinary.com/dmvmc4f1/image/upload/v1785415485/4e1d731f-c372-40bb-9dbc-119b9a225b64_bqjhxa.jpg',
    imageAlt: 'Custom Metal Furniture',
  },
];

export const PROJECT_FILTERS: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'gates', label: 'Gates' },
  { id: 'doors', label: 'Doors' },
  { id: 'staircases', label: 'Staircases' },
  { id: 'roofing', label: 'Roofing' },
  { id: 'railings', label: 'Railings' },
  { id: 'industrial', label: 'Industrial' },
  { id: 'custom', label: 'Custom' },
];

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'kwame',
    quote:
      'METAL BRIDGES delivered an exceptional gate for our home. The craftsmanship is outstanding and the attention to detail is remarkable. Kofi and his team are true professionals.',
    name: 'Kwame Mensah',
    title: 'Homeowner, East Legon',
  },
  {
    id: 'ama',
    quote:
      'We hired METAL BRIDGES for our warehouse structural work and they exceeded our expectations. Durable, well-engineered, and delivered on time. Highly recommended!',
    name: 'Ama Darko',
    title: 'Factory Manager, Tema',
  },
  {
    id: 'yaw',
    quote:
      'The stainless steel railings they installed in our office building are simply beautiful. Modern design, perfect finish, and very professional installation team.',
    name: 'Yaw Boateng',
    title: 'Business Owner, Osu',
  },
  {
    id: 'abena',
    quote:
      'From the initial consultation to the final installation, METAL BRIDGES was exceptional. Our security doors are top-notch quality and the pricing was very fair.',
    name: 'Abena Osei',
    title: 'Resident, Cantonments',
  },
];

/* ------------------------------------------------------------------ */
/* Workshop dispatches — carries every video-gallery item forward      */
/* ------------------------------------------------------------------ */

export const DISPATCHES: Dispatch[] = [
  {
    id: 'gate-fabrication-process',
    title: 'Gate Fabrication Process',
    date: 'October 2026',
    category: 'Process',
    readTime: '4 min read',
    excerpt:
      'Watch our team craft a modern sliding gate from raw steel to finished product.',
    image: IMAGES.gates,
    imageAlt: 'Gate fabrication in the workshop',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/f_mp4/v1785415402/82ce7f9f-f961-4f34-bf03-e15c9d3582ff_vewduv.mov',
    paragraphs: [
      'Every gate starts as a set of cut lengths on the workshop floor. We measure the opening, confirm the ground fall, and set out the frame on trestles before a single weld is laid.',
      'The frame is tacked square, checked diagonally, then fully welded with the infill pattern set out from a centre line. Each bar is levelled to the same datum so the shadow lines read cleanly from the street.',
      'After welding, the gate is dressed, primed, and powder-coated before the track, rollers, and motor are fitted on site. The final step is a full open-and-close cycle with the client present.',
    ],
  },
  {
    id: 'staircase-installation',
    title: 'Staircase Installation',
    date: 'September 2026',
    category: 'Structure',
    readTime: '5 min read',
    excerpt:
      'See the precision engineering behind our custom spiral staircase installation.',
    image: IMAGES.staircases,
    imageAlt: 'Custom spiral staircase installation',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/f_mp4/v1785415404/5e398746-23e5-4f0c-bbcd-d386e3ea6569_l6qtkv.mov',
    paragraphs: [
      'A spiral staircase is a geometry problem before it is a fabrication job. Rise, going, headroom, and the sweep of the handrail all have to agree before the first stringer is rolled.',
      'We build the central column and treads as a trial assembly in the workshop, then number every component so the site install follows the same sequence in reverse.',
      'On site the column is plumbed and anchored, treads are hung and levelled, and the handrail is welded and polished in place. The staircase is load-checked and walked before handover.',
    ],
  },
  {
    id: 'workshop-tour',
    title: 'Workshop Tour',
    date: 'August 2026',
    category: 'Workshop',
    readTime: '3 min read',
    excerpt:
      'A guided tour of our state-of-the-art metal fabrication workshop in Tantra Hill.',
    image: IMAGES.workshop,
    imageAlt: 'METAL BRIDGES workshop in Tantra Hill',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415421/ced4f97d-ff4c-4da2-916b-04502787101b_eivz0g.mp4',
    paragraphs: [
      'The Tantra Hill workshop is laid out around flow: cutting and forming at one end, jigging and welding in the middle, finishing and assembly at the other.',
      'We keep dedicated bays for gates and doors, a rolling bench for staircases, and a separate stainless area to avoid cross-contamination of the finish.',
      'Visitors can see raw section stock, the welding bays, the powder-coat prep area, and finished pieces waiting for delivery — all under one roof.',
    ],
  },
  {
    id: 'security-door-showcase',
    title: 'Security Door Showcase',
    date: 'July 2026',
    category: 'Security',
    readTime: '4 min read',
    excerpt:
      'Featuring our premium security door collection with modern design elements.',
    image: IMAGES.doors,
    imageAlt: 'Premium security door collection',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415425/6e8ccc0c-4d4a-4c02-bbb1-53f28e28d357_jrtd27.mp4',
    paragraphs: [
      'A security door only works if the frame, leaf, and locking system are designed together. We start with the opening and the threat, not the panel pattern.',
      'Our standard leaf uses a reinforced steel frame with a multi-point mortice lock and heavy-duty adjustable hinges. Decorative panels sit on top of that structure, never in place of it.',
      'Powder coating is applied after fabrication so the finish survives daily use. Every door is hung, adjusted, and cycled on site before we hand over the keys.',
    ],
  },
  {
    id: 'industrial-roofing-project',
    title: 'Industrial Roofing Project',
    date: 'June 2026',
    category: 'Industrial',
    readTime: '5 min read',
    excerpt:
      'Time-lapse of a large-scale industrial roofing structure installation.',
    image: IMAGES.roofing,
    imageAlt: 'Large-scale industrial roofing installation',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415423/1465e137-087c-4007-8325-6e076f83a942_k8lkpd.mp4',
    paragraphs: [
      'The Tema warehouse roof was a 24 m clear-span frame, erected in bays so the client could keep part of the yard operating during the build.',
      'Columns were set and plumbed first, then the portal rafters were lifted in pairs with purlins and bracing following behind. Wind bracing went in before any roof sheet.',
      'Sheeting, flashings, and gutters completed the envelope. The frame was checked for plumb and line at each stage, and the roof was water-tested before handover.',
    ],
  },
  {
    id: 'client-testimonial-video',
    title: 'Client Testimonial Video',
    date: 'May 2026',
    category: 'Clients',
    readTime: '3 min read',
    excerpt:
      'Hear from our satisfied clients about their experience with METAL BRIDGES.',
    image: IMAGES.founder,
    imageAlt: 'METAL BRIDGES client testimonial',
    video:
      'https://res.cloudinary.com/dmvmc4f1/video/upload/v1785415417/fb10164d-ab2a-49e2-9f9a-02b84ef9668e_sightj.mp4',
    paragraphs: [
      'Most of our work arrives by referral. A homeowner sees a gate in their neighbourhood, a site manager sees a staircase, and they ask who built it.',
      'In this dispatch, clients from East Legon, Tema, Osu, and Cantonments describe the process from first consultation to final installation.',
      'The common thread is communication: clear quotations, realistic timelines, and a team that returns to adjust a hinge or a lock long after the job is closed.',
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Why choose us — all 8 original advantage cards                      */
/* ------------------------------------------------------------------ */

export const ADVANTAGES: Advantage[] = [
  {
    title: 'Quality Craftsmanship',
    description:
      'Every project is executed with meticulous attention to detail and the highest standards of workmanship.',
  },
  {
    title: 'Precision Engineering',
    description:
      'Using modern tools and techniques to ensure exact measurements and perfect fit every time.',
  },
  {
    title: 'Modern Equipment',
    description:
      'State-of-the-art machinery and tools for superior results and efficient project completion.',
  },
  {
    title: 'Reliable Delivery',
    description:
      'We respect your timelines and deliver projects on schedule without compromising quality.',
  },
  {
    title: 'Experienced Team',
    description:
      'Skilled professionals with years of hands-on experience in diverse metal fabrication projects.',
  },
  {
    title: 'Affordable Pricing',
    description:
      'Competitive rates without hidden costs — exceptional value for premium metal fabrication.',
  },
  {
    title: 'Durable Materials',
    description:
      'Only premium-grade steel and metals are used to ensure lasting strength and performance.',
  },
  {
    title: 'Customer Satisfaction',
    description:
      'Your satisfaction is our priority — we work closely with you to exceed expectations.',
  },
];

/* ------------------------------------------------------------------ */
/* Quote form options (from the original form)                         */
/* ------------------------------------------------------------------ */

export const SERVICE_OPTIONS = SERVICES.map((service) => ({
  value: service.id,
  label: service.name,
}));

export const BUDGET_OPTIONS = [
  { value: 'under-5000', label: 'Under GHS 5,000' },
  { value: '5000-10000', label: 'GHS 5,000 – 10,000' },
  { value: '10000-25000', label: 'GHS 10,000 – 25,000' },
  { value: '25000-50000', label: 'GHS 25,000 – 50,000' },
  { value: '50000-100000', label: 'GHS 50,000 – 100,000' },
  { value: 'over-100000', label: 'Over GHS 100,000' },
];
