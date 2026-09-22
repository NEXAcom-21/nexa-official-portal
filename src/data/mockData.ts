import { ServiceOffering } from '../types';

export const NEXA_SERVICES: ServiceOffering[] = [
  {
    id: 'web-dev',
    title: 'Website Development',
    tagline: 'Modern, ultra-fast web applications built for scale',
    category: 'Development Enquiry',
    description: 'Bespoke web applications, SaaS dashboards, and landing architectures engineered with React, Next.js, and serverless infrastructure with world-class performance.',
    deliverables: [
      'High-conversion responsive design',
      'Full-stack API & Database integration',
      'SEO & OpenGraph social card optimization',
      'Sub-second load times & 99.9% uptime architecture'
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Cloud Run'],
    icon: 'Globe'
  },
  {
    id: 'android-dev',
    title: 'Android App Development',
    tagline: 'Native performance, system-level integrations & elegant UX',
    category: 'Development Enquiry',
    description: 'High-performance Android applications built with Kotlin and Jetpack Compose. Specialized in background services, accessibility tools, and hardware telemetry.',
    deliverables: [
      'Jetpack Compose reactive architecture',
      'Native Android system permissions & services',
      'Offline-first SQLite/Room database syncing',
      'Google Play Store readiness & signing'
    ],
    technologies: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Room DB', 'Android SDK'],
    icon: 'Smartphone'
  },
  {
    id: 'software-tools',
    title: 'Software & Tool Development',
    tagline: 'Automate repetitive workflows and build custom utilities',
    category: 'Development Enquiry',
    description: 'Custom internal tools, workflow automation engines, finance calculators, and cross-platform desktop utilities tailored to specific operational needs.',
    deliverables: [
      'Custom math and calculation engines',
      'Automated background data processors',
      'Hardware control interfaces',
      'Secure local data encryption'
    ],
    technologies: ['TypeScript', 'Python', 'Electron', 'REST/GraphQL APIs'],
    icon: 'Wrench'
  },
  {
    id: 'ai-integration',
    title: 'AI Integration & Agentic Systems',
    tagline: 'Empower your software with real-world intelligent capabilities',
    category: 'Service Enquiry',
    description: 'End-to-end integration of large language models, multimodal vision, speech pipelines, retrieval-augmented generation (RAG), and autonomous agent workflows.',
    deliverables: [
      'Enterprise LLM integration (Gemini, Claude, GPT)',
      'Custom vector database & knowledge embeddings',
      'Voice transcription & speech synthesis pipelines',
      'Strict guardrails and prompt safety auditing'
    ],
    technologies: ['Google GenAI SDK', 'LangChain', 'Vector DBs', 'Whisper / TTS'],
    icon: 'Cpu'
  },
  {
    id: 'ai-content',
    title: 'AI-Assisted Content Creation',
    tagline: 'High-volume, authoritative technical writing and documentation',
    category: 'Service Enquiry',
    description: 'Structured technical documentation, developer tutorials, knowledge base creation, and multilingual translation powered by curated AI workflows.',
    deliverables: [
      'Comprehensive software user manuals',
      'API reference documentation',
      'Technical blog posts & release logs',
      'Structured SEO landing copy'
    ],
    technologies: ['Markdown', 'Docusaurus', 'AI Editorial Pipelines'],
    icon: 'FileText'
  },
  {
    id: 'video-creation',
    title: 'Video Creation & Motion Graphics',
    tagline: 'Cinema-grade product launch videos and UI walkthroughs',
    category: 'Video Creation Enquiry',
    description: 'Compelling 3D product animations, app interface feature demos, trailer clips, and social media reels designed to capture audience attention.',
    deliverables: [
      'Product launch teaser videos (4K/60fps)',
      'Interactive feature walkthrough demos',
      'Custom 3D device mockup animations',
      'Sound design and voiceover sync'
    ],
    technologies: ['After Effects', 'Blender', 'Premiere Pro', 'DaVinci Resolve'],
    icon: 'Video'
  },
  {
    id: 'graphic-design',
    title: 'Image & Graphic Design',
    tagline: 'Distinctive brand identities, app icons and UI design systems',
    category: 'Image/Design Enquiry',
    description: 'Futuristic design aesthetics, minimalist vector iconography, App Store screenshots, banner graphics, and comprehensive design tokens.',
    deliverables: [
      'Custom vector app icons and logomarks',
      'Google Play Store promotional graphic sets',
      'Figma design systems & token libraries',
      'Cyberpunk / Dark mode visual identity guidelines'
    ],
    technologies: ['Figma', 'Illustrator', 'Photoshop', 'Midjourney AI Guidance'],
    icon: 'Palette'
  },
  {
    id: 'digital-products',
    title: 'Digital Product Development',
    tagline: 'Turn ambitious concepts into production-ready software ventures',
    category: 'Business Enquiry',
    description: 'Complete product lifecycle management from initial scoping, interactive wireframing, frontend engineering, backend orchestration, to deployment.',
    deliverables: [
      'Comprehensive product specification & roadmap',
      'Interactive clickable prototypes',
      'Production MVP deployment within weeks',
      'Analytics, monitoring & crash reporting setup'
    ],
    technologies: ['Full Stack Architecture', 'DevOps', 'Security Audits'],
    icon: 'Layers'
  }
];
