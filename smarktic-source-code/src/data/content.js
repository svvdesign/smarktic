// All copy comes from "Smarktic New Web site content.pdf".

export const services = [
  {
    id: 'audit',
    number: '01',
    title: 'Digital Maturity & Governance Audit',
    tagline: 'A strategic diagnostic for leaders who need clarity before scaling digital investments.',
    description:
      "This engagement provides a high-level evaluation of your organization's digital landscape, highlighting strengths, gaps, risks, and untapped opportunities.",
    listLabel: 'We assess',
    items: [
      'Digital maturity across marketing, data, and decision processes',
      'Governance practices around data access, privacy, and accountability',
      'Alignment between digital initiatives and business objectives',
      'Organizational readiness in skills, leadership, and culture',
      'Key ethical, operational, and reputational risk areas',
    ],
    deliverablesLabel: 'You receive',
    deliverables: [
      'Executive Digital Maturity Scorecard',
      'Risk & Opportunity Map',
      'Governance Gap Analysis',
      '12–18 Month Strategic Priority Roadmap',
    ],
    closing:
      'This is often the starting point for organizations that want to move forward with confidence and control.',
    accent: '#3b82f6',
  },
  {
    id: 'roadmap',
    number: '02',
    title: 'Responsible Digital Transformation Roadmap',
    tagline: 'Designing the strategic infrastructure that makes digital growth sustainable and secure.',
    description:
      'This engagement translates your ambitions into a structured transformation plan that balances performance, responsibility, and long-term resilience.',
    listLabel: 'We work on',
    items: [
      'Defining a clear digital and data strategy aligned with business priorities',
      'Establishing governance principles for responsible technology use',
      'Designing performance frameworks that connect digital initiatives to ROI',
      'Structuring decision-making processes for digital investments',
      'Reducing exposure to data, compliance, and reputational risks',
    ],
    deliverablesLabel: 'You receive',
    deliverables: [
      'Digital Transformation Master Plan',
      'Governance & Responsibility Framework',
      'ROI & KPI Measurement System',
      'Executive Decision Playbook',
    ],
    closing:
      'This is for organizations ready to move from scattered initiatives to a coherent and future-ready digital system.',
    accent: '#22d3ee',
  },
  {
    id: 'leadership',
    number: '03',
    title: 'Leadership & Culture for the Digital Era',
    tagline: 'Because transformation fails without human alignment.',
    description:
      'Technology changes fast. Culture, leadership behavior, and decision habits must evolve with it. This engagement focuses on the human side of digital transformation, ensuring that leaders and teams can effectively carry the strategy forward.',
    listLabel: 'We develop',
    items: [
      'Leadership capabilities for decision-making in complex digital environments',
      'Ethical judgment and responsibility in technology use',
      'Change management approaches that reduce resistance and increase adoption',
      'A culture that balances performance, trust, and accountability',
    ],
    deliverablesLabel: 'Formats include',
    deliverables: [
      'Executive workshops',
      'Leadership coaching cohorts',
      'Modular and hybrid learning programs',
      'Change adoption frameworks',
    ],
    closing:
      'This ensures that digital transformation is not just designed at the top — but lived across the organization.',
    accent: '#8b5cf6',
  },
]

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]))

export const requestTypes = [
  { id: 'diagnostic', label: 'Executive Diagnostic Call', hint: 'Get clarity on where you stand today.' },
  { id: 'proposal', label: 'Request a Proposal', hint: 'Scope one of our three engagements.' },
  { id: 'performance', label: 'Diagnostic de Performance', hint: 'Croissance digitale, CAC, LTV, ROI.' },
  { id: 'contact', label: 'General enquiry', hint: 'Anything else you would like to discuss.' },
]

export const roles = [
  'CEO / General Manager',
  'Transformation, Innovation or Technology Leader',
  'HR or Learning Leader',
  'Marketing / Growth Leader',
  'Other',
]

export const priorities = [
  'Digital strategy',
  'Data & technology governance',
  'Measuring business return (ROI)',
  'Ethical & reputational risk',
  'Leadership & culture',
  'Digital growth & performance',
]

export const assessmentAreas = [
  {
    id: 'maturity',
    label: 'Digital maturity',
    question: 'How mature are your digital practices across marketing, data, and decision processes?',
  },
  {
    id: 'governance',
    label: 'Governance',
    question: 'How clear are your governance practices around data access, privacy, and accountability?',
  },
  {
    id: 'alignment',
    label: 'Alignment',
    question: 'How well are your digital initiatives aligned with business objectives?',
  },
  {
    id: 'readiness',
    label: 'Readiness',
    question: 'How ready is your organization in skills, leadership, and culture?',
  },
  {
    id: 'risk',
    label: 'Risk control',
    question: 'How well are ethical, operational, and reputational risks identified and managed?',
  },
]

export const scaleLabels = ['Ad hoc', 'Emerging', 'Defined', 'Managed', 'Optimized']
