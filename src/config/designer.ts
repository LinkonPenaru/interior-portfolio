/**
 * Central Designer Profile & Contact Configuration
 * 
 * Edit this file to update personal details, bio statements, contact information,
 * and academic credentials across the entire portfolio website without touching UI components.
 */

export interface DesignerConfig {
  fullName: string;
  shortName: string;
  professionalTitle: string;
  academicCredential: string;
  institution: string;
  institutionLocation: string;
  academicClass: string;
  rollNumber: string;
  contactEmail: string;
  contactPhone?: string;
  location: string;
  statementHeading: string;
  statementIntro: string;
  bioParagraphs: string[];
  designPhilosophy: string[];
  technicalProficiencies: {
    category: string;
    skills: string[];
  }[];
  socials: {
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

export const designerConfig: DesignerConfig = {
  fullName: 'Urvi G Eragola',
  shortName: 'Urvi',
  professionalTitle: 'Interior Architecture & Spatial Design',
  academicCredential: 'Bachelor of Vocational Studies (B. Voc. Interior Design)',
  institution: "Rachana Sansad's Academy of Architecture",
  institutionLocation: 'Mumbai, Maharashtra, India',
  academicClass: 'FYBVOC',
  rollNumber: '14',
  contactEmail: 'eragolaurvi@gmail.com', // Designer's professional contact
  location: 'Mumbai, India',
  
  statementHeading: 'Architectural clarity, tactile materials, and spatial narratives.',
  statementIntro:
    'Hi, I am Urvi G Eragola. I study Interior Design at Rachana Sansad\'s Academy of Architecture. My practice focuses on rigorous spatial planning, measured technical drafting, curated material palettes, and human-centric interior atmosphere.',

  bioParagraphs: [
    'I am an interior design practitioner based in Mumbai, studying at Rachana Sansad\'s Academy of Architecture. My portfolio reflects a methodical approach to residential and commercial spatial challenges, emphasizing foundational hand-drafted layouts, joinery sections, and comprehensive specification schedules.',
    'I perceive spatial architecture as a tangible craft where physical drawing builds an intimate mastery over clearance tolerances, ergonomic comfort, and construction junctions before digital execution.',
    'Whether drafting an olive-and-copper residential kitchen, a dramatic crimson-and-black master suite, or a joyful cloud-inspired bedroom, my focus remains constant: human scale, functional efficiency, and honest materiality.'
  ],

  designPhilosophy: [
    'Foundational Technical Drafting: Hand drafting floor plans, sections, and joinery details at scales 1:2, 1:10, and 1:25 establishes rigorous tectonic discipline.',
    'Material Authenticity: Balancing matte timbers, natural stones (Nero Marquina, green marble), metallic copper accents, and acoustic wall claddings.',
    'Sensory Illumination: Crafting tiered lighting schemes from hidden cove LEDs to fiber-optic celestial constellations and task-oriented joinery fixtures.'
  ],

  technicalProficiencies: [
    {
      category: 'Drafting & Planning',
      skills: ['Orthographic Projections', '1:2 Joinery Detailing', 'False Ceiling Plans', 'Electrical Looping & Switchboard Schedules']
    },
    {
      category: 'Spatial Design',
      skills: ['Residential Planning', 'Modular Kitchen Layouts', 'Ergonomic clearances', 'Bathroom Sanitary Specifications']
    },
    {
      category: 'Material Sourcing',
      skills: ['Appliance Scheduling', 'Natural Marble & Granites', 'Veneers & Laminates', 'Acoustic Cladding Systems']
    }
  ],

  socials: {
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/in/',
  }
};
