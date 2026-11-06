import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-canvas-autopilot',
    title: 'CanvasAutoPilot',
    tagline: 'Chrome Extension syncs Canvas LMS assignments & deadlines to Google Calendar with smart reminders.',
    description: 'Never miss another quiz or submission. CanvasAutoPilot runs quietly in your browser, extracting assignment due dates, quiz time limits, and syllabus updates directly from Canvas LMS into Google Calendar and Notion with one-click webhook sync.',
    category: 'chrome-extension',
    price: 6.99,
    originalPrice: 12.00,
    creator: {
      name: 'Sarah Lin',
      handle: 'sarah_dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University',
      verified: true,
      payoutEmail: 'sarah.lin@stanford.edu',
    },
    rating: 4.9,
    reviewsCount: 142,
    salesCount: 890,
    features: [
      'Automatic 2-way sync with Canvas LMS',
      'Google Calendar, Apple Calendar & Notion integration',
      'Intelligent push notifications 24h & 2h before deadlines',
      'Grade weighting predictor and assignment score goal tracker',
      '100% client-side privacy: no credentials leave your browser'
    ],
    downloadAsset: {
      type: 'chrome_web_store',
      url: 'https://chrome.google.com/webstore/detail/canvas-autopilot',
      fileName: 'canvas-autopilot-v2.4.zip',
      licenseKeyPrefix: 'CAP'
    },
    tags: ['Productivity', 'Canvas LMS', 'Calendar', 'Chrome Extension'],
    badge: 'Trending',
    accentColor: '#3b82f6',
    iconName: 'CalendarCheck'
  },
  {
    id: 'prod-algo-visualizer',
    title: 'AlgoVisualizer Pro',
    tagline: 'Interactive 3D algorithm visualizer with 150+ LeetCode patterns for technical interview prep.',
    description: 'Designed specifically for students taking Data Structures & Algorithms or preparing for FAANG SWE internships. Step forward and backward through memory graphs, recursion trees, dynamic programming tables, and Dijkstra shortest paths in real-time.',
    category: 'code-template',
    price: 12.50,
    originalPrice: 20.00,
    creator: {
      name: 'Marcus Chen',
      handle: 'marcus_code',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'MIT',
      verified: true,
      payoutEmail: 'marcus@mit.edu',
    },
    rating: 5.0,
    reviewsCount: 310,
    salesCount: 1420,
    features: [
      'Visual breakdown for 150+ Blind75 & NeetCode patterns',
      'Step-by-step call stack and memory pointer inspector',
      'Custom input runner in Python, C++, and TypeScript',
      'Complexity analysis calculator with asymptotic curves',
      'Offline desktop app and local web server included'
    ],
    downloadAsset: {
      type: 'github',
      url: 'https://github.com/marcus-mit/algovisualizer-pro',
      fileName: 'algovisualizer-pro-bundle.zip',
      licenseKeyPrefix: 'ALGO'
    },
    tags: ['Algorithms', 'LeetCode', 'CS Prep', 'Python'],
    badge: 'Bestseller',
    accentColor: '#10b981',
    iconName: 'Binary'
  },
  {
    id: 'prod-medstudy-cramos',
    title: 'MedStudy CramOS',
    tagline: 'Notion workspace & spaced repetition Anki deck with 3,500+ cards for Pre-Med & MCAT review.',
    description: 'Built by pre-med students with 520+ MCAT scores. Includes comprehensive high-yield biology, biochemistry, organic chemistry, and psychology synthesis dashboards, clinical case trackers, and pre-configured Anki tag systems.',
    category: 'study-pack',
    price: 14.99,
    originalPrice: 29.99,
    creator: {
      name: 'Priya Patel',
      handle: 'priya_mcat',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      university: 'Johns Hopkins',
      verified: true,
      payoutEmail: 'priya.patel@jhu.edu',
    },
    rating: 4.8,
    reviewsCount: 98,
    salesCount: 640,
    features: [
      '3,500+ verified high-yield MCAT Anki flashcards',
      'Organized high-yield formula reference sheets',
      'Biochemistry pathway interactive flowchart in SVG & PDF',
      'Personalized spaced-repetition study schedule generator',
      'Full Notion template duplicate link + CSV export'
    ],
    downloadAsset: {
      type: 'notion_template',
      url: 'https://notion.so/templates/medstudy-cramos-pack',
      fileName: 'MedStudy-Anki-Decks-2026.apkg',
      licenseKeyPrefix: 'MED'
    },
    tags: ['Pre-Med', 'MCAT', 'Notion', 'Anki'],
    badge: 'Staff Pick',
    accentColor: '#ec4899',
    iconName: 'GraduationCap'
  },
  {
    id: 'prod-fastapi-micro-saas',
    title: 'Student AI Micro-SaaS Starter',
    tagline: 'Production-ready Next.js + FastAPI boilerplate to turn your student AI hackathon ideas into paid apps.',
    description: 'Stop building auth, billing, and database schemas from scratch. This starter repo includes PayPal sandbox checkout, JWT user authentication, rate limiting, and OpenAI/Gemini streaming endpoints pre-wired for student entrepreneurs.',
    category: 'saas-micro',
    price: 18.00,
    originalPrice: 35.00,
    creator: {
      name: 'David Kim',
      handle: 'dkim_labs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley',
      verified: true,
      payoutEmail: 'david.kim@berkeley.edu',
    },
    rating: 4.9,
    reviewsCount: 88,
    salesCount: 420,
    features: [
      'Pre-configured PayPal Orders & Subscriptions webhooks',
      'FastAPI backend with Pydantic validation & Async SQLAlchemy',
      'Modern Next.js 15 App Router frontend with Tailwind v4',
      'Streaming AI chat and LLM completion pipelines',
      'One-click deploy configuration for Render and Vercel'
    ],
    downloadAsset: {
      type: 'github',
      url: 'https://github.com/dkim-berkeley/student-micro-saas',
      fileName: 'student-micro-saas-template.zip',
      licenseKeyPrefix: 'SAAS'
    },
    tags: ['FastAPI', 'Next.js', 'Boilerplate', 'PayPal'],
    badge: 'New',
    accentColor: '#8b5cf6',
    iconName: 'Code2'
  },
  {
    id: 'prod-paper-synthesizer',
    title: 'ResearchPaper Synthesizer CLI',
    tagline: 'Local Python tool to summarize, cross-reference, and format 50+ arXiv/PubMed research papers.',
    description: 'Writing a term paper or literature review? Drop a folder of PDF papers into the terminal. ResearchPaper Synthesizer extracts methodologies, sample sizes, conclusions, and generates ready-to-paste BibTeX and comparison tables.',
    category: 'code-template',
    price: 8.50,
    originalPrice: 15.00,
    creator: {
      name: 'Elena Rostova',
      handle: 'elena_research',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      university: 'Oxford University',
      verified: true,
      payoutEmail: 'elena.rostova@ox.ac.uk',
    },
    rating: 4.7,
    reviewsCount: 76,
    salesCount: 380,
    features: [
      'Extracts key hypotheses, datasets, and benchmark results',
      'Outputs structured comparison tables in Markdown & Excel',
      'Automatic citation generator for APA, MLA, and BibTeX',
      'Runs 100% locally with open-source embeddings support',
      'Includes CLI flags for batch export to Obsidian'
    ],
    downloadAsset: {
      type: 'download',
      url: 'https://araxie.dev/downloads/research-synthesizer.zip',
      fileName: 'research-synthesizer-cli-v1.8.zip',
      licenseKeyPrefix: 'RES'
    },
    tags: ['Research', 'Python', 'Literature Review', 'CLI'],
    accentColor: '#06b6d4',
    iconName: 'FileText'
  },
  {
    id: 'prod-chem-reaction-3d',
    title: 'ChemReaction 3D Studio',
    tagline: 'Interactive WebGL visualization for Organic Chemistry II reaction mechanisms and orbital overlaps.',
    description: 'Struggling with SN1 vs SN2, E1/E2, and stereochemistry inversions? Rotate molecules in full 3D space, scrub through transition state electron flows, and practice predicting reaction products with interactive quizzes.',
    category: 'study-pack',
    price: 7.99,
    originalPrice: 14.00,
    creator: {
      name: 'Julian Vance',
      handle: 'julian_chem',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      university: 'Harvard University',
      verified: true,
      payoutEmail: 'julian.vance@harvard.edu',
    },
    rating: 4.9,
    reviewsCount: 114,
    salesCount: 520,
    features: [
      '60+ animated Organic Chemistry reaction mechanisms',
      'Interactive 3D orbital overlap and dipole moment views',
      'Stereochemistry inversion (R/S) visual diagnostics',
      'Flashcard quiz mode with randomized reactant problems',
      'Works seamlessly on laptop, iPad, or mobile browser'
    ],
    downloadAsset: {
      type: 'download',
      url: 'https://araxie.dev/downloads/chem-reaction-3d.zip',
      fileName: 'chem-reaction-3d-suite.zip',
      licenseKeyPrefix: 'CHEM'
    },
    tags: ['Chemistry', 'Pre-Med', '3D Graphics', 'WebGL'],
    badge: 'Trending',
    accentColor: '#f59e0b',
    iconName: 'Atom'
  },
  {
    id: 'prod-gpa-guardian',
    title: 'GPA Guardian & Curve Predictor',
    tagline: 'Chrome extension calculates historical grade distributions and predicts your final syllabus curve.',
    description: 'Know exactly what score you need on the final to get your target grade. GPA Guardian analyzes previous year grade curves, weighted grading policies, and professor habits to forecast realistic grade boundaries.',
    category: 'chrome-extension',
    price: 4.99,
    originalPrice: 9.99,
    creator: {
      name: 'Tyler Brooks',
      handle: 'tyler_tech',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      university: 'Georgia Tech',
      verified: true,
      payoutEmail: 'tbrooks@gatech.edu',
    },
    rating: 4.8,
    reviewsCount: 204,
    salesCount: 1100,
    features: [
      'Integrates directly into student portal grading tables',
      'Scenario simulation: "What if I get 85% on the final?"',
      'Historical curve analyzer from past semester syllabus archives',
      'Exportable grade report PDF for academic advising',
      'Dark mode friendly with custom school color themes'
    ],
    downloadAsset: {
      type: 'chrome_web_store',
      url: 'https://chrome.google.com/webstore/detail/gpa-guardian',
      fileName: 'gpa-guardian-extension.crx',
      licenseKeyPrefix: 'GPA'
    },
    tags: ['GPA', 'Chrome Extension', 'Student Utility', 'Grades'],
    accentColor: '#e11d48',
    iconName: 'ShieldCheck'
  },
  {
    id: 'prod-academic-prompt-vault',
    title: 'Academic Writing AI Prompt Vault',
    tagline: '250+ battle-tested prompts for academic papers, thesis defenses, peer review rebuttal, and LaTeX.',
    description: 'Stop getting generic AI fluff. The Academic Writing AI Prompt Vault contains finely calibrated, scholarly prompts that enforce formal academic tone, correct citation formats, argumentative rigor, and LaTeX formatting.',
    category: 'ai-prompt',
    price: 5.50,
    originalPrice: 10.00,
    creator: {
      name: 'Amara Okafor',
      handle: 'amara_phd',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      university: 'University of Toronto',
      verified: true,
      payoutEmail: 'amara.okafor@utoronto.ca',
    },
    rating: 4.9,
    reviewsCount: 165,
    salesCount: 780,
    features: [
      '250+ categorized prompts for Literature Reviews, Methodology & Discussion',
      'Reviewer #2 rebuttal generator with diplomatic academic tone',
      'LaTeX table and formula troubleshooting prompts',
      'Plagiarism-safe paraphrasing & clarity enhancer templates',
      'Includes 1-click import into ChatGPT, Claude, and Gemini'
    ],
    downloadAsset: {
      type: 'download',
      url: 'https://araxie.dev/downloads/academic-prompt-vault.pdf',
      fileName: 'academic-prompt-vault-2026.pdf',
      licenseKeyPrefix: 'PRMT'
    },
    tags: ['AI Prompts', 'Writing', 'Academic', 'Thesis'],
    badge: 'Staff Pick',
    accentColor: '#f97316',
    iconName: 'Sparkles'
  }
];
