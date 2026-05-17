import { TEMPLATE_IDS } from '../components/LivePreview';

export const AVAILABLE_TEMPLATES = [
    {
        id: TEMPLATE_IDS.ATS_CLASSIC,
        name: 'ATS Classic',
        type: 'ATS-Friendly',
        description: 'Clean, simple, and parsing-optimized. Best for corporate applications.',
        isPremium: false,
    },
    {
        id: TEMPLATE_IDS.ATS_MINIMAL,
        name: 'ATS Minimal',
        type: 'ATS-Friendly',
        description: 'Minimalist layout with clear hierarchy. High readability.',
        isPremium: false,
    },
    {
        id: TEMPLATE_IDS.MODERN,
        name: 'Modern',
        type: 'Premium',
        description: 'Sleek sidebar design with a professional color accent.',
        isPremium: true,
    },
    {
        id: TEMPLATE_IDS.ELEGANT,
        name: 'Elegant',
        type: 'Premium',
        description: 'Serif typography and centered layout for a sophisticated look.',
        isPremium: true,
    },
    {
        id: TEMPLATE_IDS.CREATIVE,
        name: 'Creative',
        type: 'Premium',
        description: 'Bold header and unique geometry. Stand out in creative fields.',
        isPremium: true,
    },
    {
        id: TEMPLATE_IDS.TECH,
        name: 'Tech',
        type: 'Premium',
        description: 'Monospaced font and code-inspired aesthetics for developers.',
        isPremium: true,
    },
    {
        id: TEMPLATE_IDS.EXECUTIVE,
        name: 'Executive',
        type: 'Premium',
        description: 'Authoritative and traditional. Perfect for senior roles.',
        isPremium: true,
    },
];

export const DUMMY_RESUME_DATA = {
    personal: {
        fullName: 'Alex Morgan',
        designation: 'Senior Product Designer',
        email: 'alex.morgan@example.com',
        phoneNumber: '+1 234 567 890',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexmorgan',
        website: 'alexmorgan.design',
        github: 'github.com/alexmorgan',
        summary: 'Creative and detail-oriented Product Designer with 5+ years of experience building user-centric digital products. Expert in UI/UX, prototyping, and design systems.'
    },
    experience: [
        { company: 'TechNova', role: 'Senior UX Designer', startDate: '2021-03', endDate: 'Present', description: 'Led the redesign of the core mobile app, increasing user retention by 25%. Mentored junior designers.' },
        { company: 'Creative Studio', role: 'UI Designer', startDate: '2018-06', endDate: '2021-02', description: 'Designed marketing websites and brand identities for diverse clients. Collaborated with developers to ensure pixel-perfect implementation.' }
    ],
    education: [
        { institution: 'Rhode Island School of Design', degree: 'BFA in Graphic Design', year: '2018' }
    ],
    projects: [
        { title: 'E-Commerce Dashboard', description: 'A comprehensive analytics dashboard for online retailers.', liveDemo: 'demo.com', github: 'github.com/project' },
        { title: 'Travel App UI Kit', description: 'Open-source UI kit with 50+ screens.', liveDemo: 'figma.com/file', github: '' }
    ],
    skills: [
        { name: 'Figma' }, { name: 'React' }, { name: 'Prototyping' }, { name: 'User Research' }, { name: 'HTML/CSS' }
    ],
    certifications: [
        { title: 'Google UX Design Professional Certificate', issuer: 'Coursera', year: '2020' }
    ],
    languages: [
        { name: 'English' }, { name: 'Spanish' }
    ],
    interests: [
        { name: 'Photography' }, { name: 'Traveling' }, { name: 'Hiking' }
    ]
};
