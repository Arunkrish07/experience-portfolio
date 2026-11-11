// =============================================================
//  EDIT YOUR CONTENT HERE
//  [ ... ] marks things only you can fill in (app names, links, images).
// =============================================================

export const profile = {
  year: '2026',
  name: 'Arunkumar Krishnamoorthi',
  role: 'Full Stack Developer',
  location: 'Chennai',
  badge: 'Open to work · 30-day notice',
  heroWord: 'Portfolio',
  heroSignature: 'Arunkumar',
  tagline:
    'I build web and mobile apps with React, React Native, Python and Django, and ship them to the Play Store.',
  bioLead: 'Hello.',
  bio: `I'm a Full Stack Developer based in Chennai with 1 year of experience building web and
  mobile applications from requirement to deployment. I work with React, React Native, Python,
  Django, Supabase (PostgreSQL) and SQL. I've delivered products for public sector tendering,
  healthcare, real estate, workforce management and fintech, and published apps on Google Play.
  I use Claude Code and GenAI prompt engineering to build faster, and I'm now growing my skills
  in AI engineering. I'm looking for Full Stack, Python and React Native roles where I can keep
  shipping real products.`,
  traits: ['full-stack', 'React · Django', 'ships to Play Store', 'AI-assisted', 'end-to-end', 'fast learner'],
  photo: '/arun.jpg',
  resumeUrl: '#', // [add your resume link / PDF]
}

// Recruiter "quick view" facts
export const quickView = [
  { k: 'Role', v: 'Full Stack Developer (React, React Native, Python/Django)' },
  { k: 'Location', v: 'Chennai — open to Bangalore, Hyderabad & remote' },
  { k: 'Experience', v: '1 year' },
  { k: 'Notice period', v: '30 days' },
  { k: 'Live work', v: 'Apps on Google Play · GitHub projects' },
]

export const education = [
  {
    school: 'Sri Raaja Raajan College of Engineering and Technology',
    detail: 'B.E., Computer Science',
    year: 'Oct 2021 — May 2025',
  },
]

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Anvas Tech',
    place: 'Mylapore, Chennai',
    year: 'Sep 2025 — present',
    points: [
      'Built and delivered full-stack web and mobile apps with Python, Django, React and React Native, from requirement analysis through deployment.',
      'Developed backend services and databases with Supabase (PostgreSQL) and SQL for production-ready applications.',
      'Used Claude Code and GenAI prompt engineering to speed up feature development, code generation and debugging.',
      'Contributed to system-design discussions for scalable, multi-domain applications.',
      'Worked with cross-functional teams to deliver client-facing products within tight timelines.',
    ],
  },
]

// =============================================================
//  SKILLS
// =============================================================
export const skillApps = [
  { label: 'React', bg: '#20232A', fg: '#61DAFB' },
  { label: 'RN', bg: '#20232A', fg: '#61DAFB' },
  { label: 'Py', bg: '#2B5B84', fg: '#FFD343' },
  { label: 'Dj', bg: '#0C4B33', fg: '#44B78B' },
  { label: 'Supa', bg: '#1C1C1C', fg: '#3ECF8E' },
]

// "Currently learning" — shown as the stack of spines
export const books = [
  { title: 'AI DOCUMENT EXTRACTOR', bg: '#1F1F22', fg: '#ECEBE7' },
  { title: 'PDF / WORD / EXCEL PARSING', bg: '#EDEAE2', fg: '#1F1F22' },
  { title: 'RAG + VECTOR SEARCH', bg: '#D79A3C', fg: '#1F1F22' },
  { title: 'LLM APIs', bg: '#2C3A52', fg: '#ECEBE7' },
  { title: 'FASTAPI', bg: '#0C4B33', fg: '#ECEBE7' },
]

export const skillsIntro =
  'Full-stack across web and mobile — from requirement analysis to deployment, with AI-assisted development using Claude Code and GenAI prompt engineering.'

export const skillTags = [
  ['React', 'React Native', 'JavaScript', 'Claude Code', 'GenAI prompt engineering'],
  ['Python', 'Django', 'Supabase', 'PostgreSQL / SQL', 'Git · GitHub · Agile'],
]

// =============================================================
//  PROJECTS  (images + links come later — set `cover` and `links`)
//  Each uses two accent colours: `accent` + `accent2`.
// =============================================================
export const projects = [
  {
    id: 'healthcare-op',
    index: '01',
    name: 'Healthcare OP Seat Process',
    category: 'Web application · Healthcare',
    tag: 'healthcare',
    tagline: 'Outpatient seat allocation and queuing that improves patient flow.',
    accent: '#5B8DEF',
    accent2: '#A9C6F6',
    cover: '/healthcare/landing.jpg',
    screens: ['/healthcare/landing.jpg', '/healthcare/login.jpg', '/healthcare/dashboard.jpg'],
    description: `A system that manages outpatient seat allocation and queuing for a healthcare
    provider, improving patient flow and appointment handling.`,
    stack: [], // [add stack]
    links: {
      live: 'https://ehealth.anvastech.in',
      github: 'https://github.com/Arunkrish07/Health-care-outpatient-OP-seat-processing-system',
    },
  },
  {
    id: 'tender-management',
    index: '02',
    name: 'Tender Management System',
    category: 'Web application · Public sector',
    tag: 'gov tech',
    tagline: 'Tender publishing, submission and tracking for a public welfare department.',
    accent: '#2E9E6B',
    accent2: '#A7D9B9',
    cover: '/tender/signin.jpg',
    screens: ['/tender/signin.jpg', '/tender/districts.jpg', '/tender/admin.jpg'],
    description: `A web application for tender publishing, submission and status tracking for a
    Public Welfare Department.`,
    stack: ['Django', 'React'],
    links: {
      live: 'https://marketvendorplace.vercel.app/',
      github: 'https://github.com/Arunkrish07/marketvendorplace.git',
    },
  },
  {
    id: 'property-management',
    index: '03',
    name: 'Property Management App',
    category: 'Web & mobile · Real estate',
    tag: 'real estate',
    tagline: 'Property listing, tracking and management across web and mobile.',
    accent: '#C7893B',
    accent2: '#E6C79A',
    cover: '/property/financials.jpg',
    screens: ['/property/financials.jpg', '/property/electricity.jpg', '/property/tickets.jpg'],
    description: `An app for property listing, tracking and management across web and mobile,
    with a shared data layer between platforms.`,
    stack: ['React', 'React Native'],
    links: {
      live: 'https://www.vishful.co.in',
      play: 'https://play.google.com/store/apps/details?id=dev.a0.apps.vishfulpm538',
      github: 'https://github.com/Arunkrish07/vishful-mobile',
    },
  },
  {
    id: 'attendance-app',
    index: '04',
    name: 'Attendance App',
    category: 'Mobile application · Workforce',
    tag: 'on Google Play',
    tagline: 'Real-time attendance capture and reporting.',
    accent: '#9AA050',
    accent2: '#CBCF93',
    cover: '/attendance/dashboard.jpg',
    screens: ['/attendance/dashboard.jpg', '/attendance/facescan.jpg', '/attendance/settings.jpg'],
    description: `A mobile app for real-time attendance capture and reporting, with a Supabase
    backend. Published on Google Play.`,
    stack: ['React Native', 'Supabase'],
    links: {
      play: 'https://play.google.com/store/apps/details?id=dev.a0.apps.a0filetransfer968',
      github: 'https://github.com/Arunkrish07/attendance-app',
    },
  },
  {
    id: 'fintech-app',
    index: '05',
    name: 'Fintech App',
    category: 'Web application · Fintech',
    tag: 'finance',
    tagline: 'Business finance management with live cash-flow dashboards.',
    accent: '#7D84EF',
    accent2: '#BFC3F7',
    cover: '/fintech/overview.jpg',
    screens: ['/fintech/collections.jpg', '/fintech/loans.jpg', '/fintech/overview.jpg'],
    description: `A web application for business finance — tracking income, expenses and cash flow,
    bank loans and EMIs, and rental collections across live dashboards.`,
    stack: ['React', 'Supabase', 'SQL'],
    links: {
      live: 'https://my-personal-fintrack.vercel.app',
      github: 'https://github.com/Arunkrish07/my-personal-fintrack',
    },
  },
]

// =============================================================
//  HOW I BUILD  (shown where "Fun Facts" used to be)
// =============================================================
export const howIBuild = {
  note: 'the way I work',
  heading: 'How I build',
  steps: [
    'Understand the requirement',
    'Plan the data and the screens',
    'Build the feature end to end',
    'Test it properly',
    'Deploy it',
    'AI-assisted with Claude Code — read, test and fix before it ships',
  ],
}

// =============================================================
//  FUN FACTS  (placeholders — replace with your own real ones)
// =============================================================
export const funFacts = {
  note: 'the things that never fit on a CV',
  heading: 'Fun Facts',
  items: [
    'I sketch app flows on paper before I touch any code',       // lightbulb
    'Chennai filter coffee — two cups before the first commit',  // coffee cup
    'I code best with lo-fi beats on loop',                      // music note
    'Top of my travel list: Japan',                             // location pin
    'I love turning messy manual work into a clean little app',  // heart
    'Mostly self-taught — I learn by shipping and breaking things', // sparkle
  ],
}

// =============================================================
//  CONTACT / FOOTER
// =============================================================
export const contact = {
  heading: "Let's work together",
  email: 'arunkumarkrishnamoorthii@gmail.com',
  phone: '7695932824',
  closing: [
    `I'm open to Full Stack, Python and React Native developer roles in Chennai,
    Bangalore, Hyderabad and remote.`,
    `I can join after a 30-day notice period — let's talk.`,
  ],
  signature: 'Arunkumar',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Arunkrish07' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/arunkrishk' },
    { label: 'Email', href: 'mailto:arunkumarkrishnamoorthii@gmail.com' },
  ],
}
