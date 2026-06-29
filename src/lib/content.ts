export const stats = [
  { value: "1979", label: "Established with a legacy of precision execution" },
  { value: "45+", label: "Years of trusted turnkey delivery" },
  { value: "Pan India", label: "Execution capability across the nation" },
  { value: "6 Mo.", label: "Post-completion service assurance" },
];

/** WhatsApp — E.164 without + prefix for wa.me links */
export const whatsappContact = {
  phone: "919831038457",
  displayPhone: "+91 98310 38457",
  defaultMessage:
    "Hello Build Design Projects, I would like to discuss my project.",
};

export const companyAddress = {
  line1: "30f, Mirza Ghalib Street (Free school street)",
  line2: "Kolkata - 700016",
};

export const aboutSpecialization =
  "We specialize in creating functional, elegant interiors and handcrafted furniture pieces — from solid wood beds and dining sets to console tables and library cabinets. Whether it's a minimalist studio or a classic heritage bungalow, we infuse each space with warmth, character, and usability.";

export const aboutFeatures = [
  {
    number: "01",
    title: "Single-Point Ownership",
    description: "One accountable team across every project phase.",
  },
  {
    number: "02",
    title: "Tailored Turnkey Delivery",
    description: "Solutions shaped to each residential and commercial brief.",
  },
  {
    number: "03",
    title: "Pan India Execution",
    description: "Premium delivery capability across the nation.",
  },
  {
    number: "04",
    title: "Built for Long-Term Value",
    description: "Quality, timelines, and post-completion assurance.",
  },
];

export const coreAdvantages = [
  "Single-point ownership of high-value projects",
  "Access to premium materials, global sourcing & technologies",
  "Pan India execution capability",
  "Authorized partnerships with leading brands",
  "Post-completion service assurance",
];

export const approachPoints = [
  "Consistent quality across all stages",
  "Strict adherence to timelines",
  "Seamless coordination across disciplines",
  "Zero dependency on fragmented vendors",
];

export type Service = {
  title: string;
  headline: string[];
  description: string;
  items: string[];
  image: string;
};

export type ServiceProcessStep = {
  number: string;
  title: string;
  summary: string;
  detail: string;
};

export const servicePillars = [
  {
    title: "Design",
    description:
      "We shape bespoke turnkey solutions tailored to each residential and commercial brief — from concept to coordinated documentation.",
  },
  {
    title: "Execution",
    description:
      "Structure, systems, and finishes delivered through one accountable team with disciplined project management.",
  },
  {
    title: "Delivery",
    description:
      "Global sourcing, precision installation, and post-completion assurance across Pan India.",
  },
];

export const serviceProcessSteps: ServiceProcessStep[] = [
  {
    number: "01",
    title: "Single-Point Project Ownership",
    summary:
      "A dedicated team manages every stage of the project, ensuring seamless coordination, accountability, and timely delivery.",
    detail:
      "A dedicated team manages every stage of the project, ensuring seamless coordination, accountability, and timely delivery.",
  },
  {
    number: "02",
    title: "Premium Materials & Global Sourcing",
    summary:
      "Access to high-quality materials, international suppliers, and advanced technologies to achieve superior results.",
    detail:
      "Access to high-quality materials, international suppliers, and advanced technologies to achieve superior results.",
  },
  {
    number: "03",
    title: "Solid Wood Craftsmanship",
    summary:
      "Expertly crafted solid wood furniture and joinery that combine durability, functionality, and timeless aesthetics.",
    detail:
      "Expertly crafted solid wood furniture and joinery that combine durability, functionality, and timeless aesthetics.",
  },
  {
    number: "04",
    title: "Authorized Brand Partnerships",
    summary:
      "Trusted collaborations with leading brands to provide certified products, reliable performance, and premium finishes.",
    detail:
      "Trusted collaborations with leading brands to provide certified products, reliable performance, and premium finishes.",
  },
  {
    number: "05",
    title: "Post-Completion Service Assurance",
    summary:
      "Comprehensive after-sales support and maintenance services to ensure lasting quality and peace of mind.",
    detail:
      "Comprehensive after-sales support and maintenance services to ensure lasting quality and peace of mind.",
  },
];

export const services: Service[] = [
  {
    title: "Construction & Structural Execution",
    headline: ["Construction &", "Structural—", "Execution"],
    description:
      "High-value residential and commercial builds delivered with complete structural integrity and disciplined project management.",
    items: [
      "High-value residential & commercial construction",
      "Structural engineering & civil execution",
      "Complete project management & delivery",
    ],
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  },
  {
    title: "Engineering & Systems Integration",
    headline: ["Engineering &", "Systems—", "Integration"],
    description:
      "Advanced electrical, plumbing, HVAC, and lighting systems engineered and integrated under one accountable team.",
    items: [
      "Advanced electrical infrastructure",
      "Plumbing & water management systems",
      "HVAC, heating & climate control",
      "Architectural and ambient lighting systems",
    ],
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
  },
  {
    title: "Materials, Finishes & Installations",
    headline: ["Materials,", "Finishes &—", "Installations"],
    description:
      "Premium stone, glass, metal fabrication, and finishing systems sourced and installed to global standards.",
    items: [
      "Premium fixtures and fittings",
      "Stone, glass, metal, and custom fabrication",
      "Waterproofing, protection, and finishing systems",
    ],
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },
  {
    title: "Lifestyle & Luxury Integrations",
    headline: ["Lifestyle &", "Luxury—", "Integrations"],
    description:
      "Smart home automation, private theatres, heated pools, and bespoke entertainment infrastructure — fully integrated.",
    items: [
      "Smart home automation ecosystems",
      "Private home theatres & acoustic environments",
      "Heated swimming pools",
      "Entertainment infrastructure (including bowling alleys)",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  },
  {
    title: "Global Sourcing & High-End Procurement",
    headline: ["Global Sourcing", "& High-End—", "Procurement"],
    description:
      "Direct access to imported materials, bespoke finishes, and specialized technologies from international suppliers.",
    items: [
      "Imported materials and bespoke finishes",
      "High-end appliances, televisions, and sound systems",
      "International sourcing of specialized technologies",
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  },
  {
    title: "Prefab & Advanced Build Systems",
    headline: ["Prefab &", "Advanced—", "Build Systems"],
    description:
      "Prefabricated and modular construction solutions that accelerate delivery without compromising precision.",
    items: [
      "Prefabricated construction solutions",
      "Modular and rapid-build systems",
    ],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  },
];

export type Project = {
  name: string;
  description: string;
  scope: string;
  image: string;
  imageSecondary: string;
  headline: string[];
};

export const residentialProjects: Project[] = [
  {
    name: "10 Sunny Park, Ballygunge",
    headline: ["10 SUNNY", "PARK", "BALLYGUNGE"],
    description:
      "Premium residential interior project in one of Kolkata's most prestigious addresses.",
    scope: "Full Interior Design & Furniture Manufacturing",
    image: "/images/projects/sunny-park-ballygunge/bedroom.png",
    imageSecondary: "/images/projects/sunny-park-ballygunge/common-area.png",
  },
  {
    name: "Forum Atmosphere",
    headline: ["FORUM", "ATMOSPHERE"],
    description:
      "Luxury apartment interior work in Kolkata's iconic sky bungalow towers.",
    scope: "Full Interior Design & Execution",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
  },
  {
    name: "12/6 Ballygunge Park Road",
    headline: ["BALLYGUNGE", "PARK ROAD"],
    description:
      "Customized home interior with elegant space planning and bespoke furniture.",
    scope: "Full Interior Design & Furniture Manufacturing",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
  },
  {
    name: "Orbit Regency",
    headline: ["ORBIT", "REGENCY"],
    description:
      "Complete residential design solution with modern finishes and detailing.",
    scope: "Full Interior Design & Execution",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
  },
  {
    name: "Ekta Oleander",
    headline: ["EKTA", "OLEANDER"],
    description:
      "Contemporary interiors with smart storage and premium woodwork.",
    scope: "Full Interior Design & Furniture Manufacturing",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
  },
  {
    name: "Oni Bilet Tariang Bungalow, Shillong",
    headline: ["TARIANG", "BUNGALOW", "SHILLONG"],
    description:
      "Traditional bungalow design blended with natural materials and scenic charm.",
    scope: "Full Interior Design & Execution",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=900&q=80",
  },
];

export const commercialProjects: Project[] = [
  {
    name: "TFS Banchharam, Kolkata Airport",
    headline: ["TFS", "BANCHHARAM", "AIRPORT"],
    description:
      "Interior fit-out for a leading food outlet, combining branding with functionality.",
    scope: "Commercial Fit-Out & Execution",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80",
  },
  {
    name: "TFS Ultra Bar, Bhubaneswar Airport",
    headline: ["TFS ULTRA", "BAR LOUNGE"],
    description:
      "High-end bar and lounge design with attention to lighting and spatial experience.",
    scope: "Commercial Interior Execution",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
  },
  {
    name: "ITC Center, Kolkata",
    headline: ["ITC CENTER", "KOLKATA"],
    description:
      "Conference rooms, media rooms, and photoshoot spaces with acoustic treatment and tech integration.",
    scope: "Corporate Execution for ITC Group",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
  },
  {
    name: "ITC Raleigh Court & Victoria View",
    headline: ["ITC RALEIGH", "VICTORIA VIEW"],
    description:
      "Comprehensive civil work execution maintaining ITC's high standards.",
    scope: "Complete Civil Works",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80",
  },
  {
    name: "Meet Up Café, Kolkata",
    headline: ["MEET UP", "CAFÉ"],
    description:
      "Vibrant café interiors designed for comfort and engagement.",
    scope: "Commercial Interior Design",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
  },
  {
    name: "DI Club, Kolkata",
    headline: ["DI CLUB", "KOLKATA"],
    description:
      "Contemporary club interior designed for a dynamic social environment.",
    scope: "Commercial Fit-Out",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80",
  },
];

export type CollectionProject = Project & {
  category: "Residential" | "Commercial";
  location: string;
  featured?: boolean;
  isNew?: boolean;
};

export const collectionSortOptions = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Alphabetically, A-Z" },
  { value: "name-desc", label: "Alphabetically, Z-A" },
  { value: "category", label: "Category" },
] as const;

export type CollectionSort = (typeof collectionSortOptions)[number]["value"];

export const collectionCategoryFilters = [
  "All",
  "Residential",
  "Commercial",
] as const;

export const bestSellerProjects: CollectionProject[] = [
  ...residentialProjects.map((project, index) => ({
    ...project,
    category: "Residential" as const,
    location:
      index === 5
        ? "Shillong"
        : project.name.includes("Ballygunge")
          ? "Kolkata"
          : "Kolkata",
    featured: index < 3,
    isNew: index === 0,
  })),
  ...commercialProjects.map((project, index) => ({
    ...project,
    category: "Commercial" as const,
    location: project.name.includes("Bhubaneswar")
      ? "Bhubaneswar"
      : project.name.includes("Airport")
        ? "Airport"
        : "Kolkata",
    featured: index < 2,
    isNew: index === 0,
  })),
];

export const collectionScopeFilters = [
  ...new Set(bestSellerProjects.map((p) => p.scope)),
].sort();

export const collectionLocationFilters = [
  ...new Set(bestSellerProjects.map((p) => p.location)),
].sort();

export const partners = [
  "ITC Limited",
  "Travel Food Services (TFS)",
  "American Consulate, Kolkata",
  "Steel Authority of India (SAIL)",
  "British Deputy High Commission, Kolkata",
];

export const trustedVendorClients = [
  "ITC LIMITED, CENTRE HEAD OFFICE, KOLKATA",
  "TRAVEL FOOD SERVICES (TFS)",
  "AMERICAN CONSULATE, KOLKATA",
  "STEEL AUTHORITY OF INDIA (SAIL)",
  "BRITISH DEPUTY HIGH COMMISSION, KOLKATA",
];

export const trustedClientLogos = [
  {
    name: "U.S. Department of State",
    src: "/images/partners/us-consulate.png",
  },
  {
    name: "British High Commission New Delhi",
    src: "/images/partners/british-high-commission.png",
  },
  {
    name: "Steel Authority of India (SAIL)",
    src: "/images/partners/sail.png",
  },
  {
    name: "Travel Food Services (TFS)",
    src: "/images/partners/tfs.png",
  },
  {
    name: "ITC Limited",
    src: "/images/partners/itc.png",
  },
];

export const officialPartnerships = [
  {
    title:
      "AUTHORIZED DEALER OF DISHA PAVERS (PREMIUM OUTDOOR FLOORING SOLUTIONS)",
    logo: {
      name: "Disha Pavers",
      src: "/images/partners/disha-pavers.png",
    },
  },
  {
    title:
      "CHANNEL PARTNER OF ROYAL TINT (SMART SWITCHABLE GLASS TECHNOLOGY)",
    logo: {
      name: "Royal Tint",
      src: "/images/partners/royal-tint.png",
    },
  },
];

export const credibilityPoints = [
  "Proven capability at scale",
  "Experience with high-value environments",
  "Consistent execution standards",
  "Trusted by established organizations",
];

export const beliefs = [
  {
    number: "01",
    title: "Single-point ownership",
    description:
      "Complete control of every project layer through one accountable team.",
  },
  {
    number: "02",
    title: "Precision without compromise",
    description:
      "Engineered execution where quality, timelines, and discretion align.",
  },
  {
    number: "03",
    title: "Global sourcing advantage",
    description:
      "Direct access to premium brands and international suppliers.",
  },
  {
    number: "04",
    title: "Pan India capability",
    description:
      "Consistent execution quality regardless of location across India.",
  },
  {
    number: "05",
    title: "Post-completion assurance",
    description:
      "Six months of dedicated service support beyond project handover.",
  },
];

export type TeamLead = {
  name: string;
  role: string;
  phone: string;
  photo: string;
};

export type TeamPillar = {
  number: string;
  title: string;
  description: string;
};

export const teamHeroProjects = [
  "Ballygunge",
  "Sunny Park",
  "Kolkata Airport",
  "ITC Center",
  "Shillong",
  "Bhubaneswar",
  "Forum Atmosphere",
  "Orbit Regency",
];

export type OrbitItem = { label: string; image: string };

// Project circles that orbit the growing sphere on the Team hero.
export const teamOrbit: OrbitItem[] = [
  {
    label: "Ballygunge",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
  },
  {
    label: "Forum Atmosphere",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  },
  {
    label: "Kolkata Airport",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    label: "ITC Center",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
  },
  {
    label: "Shillong",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
  },
  {
    label: "Bhubaneswar",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
  },
];

export const teamLeads: TeamLead[] = [
  {
    name: "Rupak Khan",
    role: "Managing Director",
    phone: "+91 98310 38457",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    name: "Arjun Mehta",
    role: "Head of Execution",
    phone: "+91 98300 11223",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
  {
    name: "Priya Nair",
    role: "Design Director",
    phone: "+91 98311 44556",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    name: "Sandeep Roy",
    role: "Projects Lead",
    phone: "+91 98312 77889",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];

export const teamMembers = [
  "Ananya Sen",
  "Vikram Das",
  "Meera Iyer",
  "Rohit Banerjee",
  "Kavya Sharma",
  "Imran Sheikh",
  "Tanvi Gupta",
  "Aditya Bose",
  "Neha Kapoor",
  "Suraj Pillai",
  "Ritika Jain",
  "Karan Malhotra",
  "Pooja Reddy",
  "Dev Chatterjee",
  "Sneha Rao",
  "Manish Verma",
  "Aisha Khan",
  "Gaurav Singh",
  "Lakshmi Menon",
  "Rahul Dutta",
  "Shruti Joshi",
  "Nikhil Pandey",
  "Divya Saxena",
  "Akash Ghosh",
];

export const teamPillars: TeamPillar[] = [
  {
    number: "01",
    title: "One accountable team",
    description:
      "No fragmented vendors. Every discipline — construction, engineering, sourcing, finishing — sits under a single point of ownership.",
  },
  {
    number: "02",
    title: "Precision over noise",
    description:
      "We obsess over detail and timelines. Drawings match reality, and reality matches the brief.",
  },
  {
    number: "03",
    title: "Built around the client",
    description:
      "We map the way each client lives and works, then shape the execution to fit — not the other way around.",
  },
  {
    number: "04",
    title: "Global standards, local execution",
    description:
      "Premium materials and international technologies, integrated with on-ground discipline across India.",
  },
  {
    number: "05",
    title: "Beyond handover",
    description:
      "Six months of dedicated service assurance means our responsibility doesn't end at the door.",
  },
];

export const faqs = [
  {
    question: "What types of projects do you execute?",
    answer:
      "We deliver end-to-end turnkey solutions for luxury residential homes, corporate environments, airport and hospitality projects, and high-spec commercial spaces — from structure to systems to final experience.",
  },
  {
    question: "What makes Build Design Projects unique?",
    answer:
      "Since 1979, we have integrated construction, engineering systems, global sourcing, and advanced lifestyle infrastructure under one accountable team — eliminating fragmented vendors and ensuring seamless execution.",
  },
  {
    question: "What is your geographic coverage?",
    answer:
      "Our teams operate across India, delivering projects with the same level of control, detail, and execution quality — from Kolkata to Shillong and beyond.",
  },
  {
    question: "Who are your trusted partners and clients?",
    answer:
      "We are approved vendors to premier institutions including ITC Limited, Travel Food Services (TFS), American Consulate Kolkata, SAIL, and British Deputy High Commission Kolkata.",
  },
];
