import { Venue, Cocktail, SkillItem } from "./types";

export const COVER_INFO = {
  tagline: "THE LIQUID MENU",
  name: "Hemakshe Nagaraj",
  role: "Brand Advocate & Mixologist, Bengaluru",
  quote: "I don't just make drinks. I control how a night feels — one glass at a time.",
  credentials: [
    { value: "7+", label: "Years Behind the Bar" },
    { value: "15+", label: "Diageo Academy Certificates" },
    { value: "5", label: "Premium Venues Curated" }
  ],
  scrollText: "Scroll to explore ↓"
};

export const METRIC_CARDS = [
  { value: "7+", label: "Years Behind the Bar" },
  { value: "15+", label: "Diageo Bar Academy" },
  { value: "B.A.", label: "Psychology · Literature · Journalism" },
  { value: "50+", label: "Private Events Curated" }
];

export const PHILOSOPHY = {
  tag: "02 — THE APERITIF",
  heading: "The Philosophy",
  pullQuote: "True brand advocacy is 50% what's in the glass — and 50% how you talk about it.",
  body1: "Seven years of high-volume, fine-dining, and private-event bartending have taught me that the most powerful thing behind any bar isn't technique — it's the story you tell with every pour.",
  body2: "With a background in Psychology, Literature, and Journalism, I bridge the gap between trade execution and consumer storytelling — crafting experiences that move product and build genuine loyalty.",
  tags: [
    "Menu Engineering",
    "Brand Storytelling",
    "Trade Advocacy",
    "Team Leadership"
  ]
};

export const VENUES: Venue[] = [
  {
    id: "casa-picossa",
    name: "Casa Picossa",
    role: "Senior Bartender",
    description: "Led bar operations and cocktail menu development. Drove cost optimization through precision pour standards and seasonal ingredient rotation.",
    tags: ["Menu Engineering", "Team Lead", "Cost Control"]
  },
  {
    id: "46-ounces",
    name: "46 Ounces",
    role: "Senior Bartender",
    description: "Co-architected the cocktail program from conception. Mentored junior staff in technical precision — translating deep product knowledge into real revenue.",
    tags: ["Program Development", "Staff Training", "Revenue Growth"]
  },
  {
    id: "taki-taki",
    name: "Taki Taki",
    role: "Senior F&B Associate",
    description: "Fine-dining Japanese environment with zero tolerance for imprecision. Curated Japanese whisky and premium spirits to complement omakase menus.",
    tags: ["Spirits Curation", "Fine Dining", "Guest Experience"]
  },
  {
    id: "watsons",
    name: "Watson's",
    role: "Bartender",
    description: "High-velocity operations at one of Bengaluru's busiest bars. Built exceptional guest loyalty through consistent craft and room command.",
    tags: ["High-Volume", "Guest Retention", "Speed Without Compromise"]
  },
  {
    id: "coox",
    name: "COOX Partner Network",
    role: "Freelance Specialist",
    description: "Bespoke cocktail experiences for high-net-worth private gatherings. Full concept-to-execution: menu design, sourcing, service, debrief.",
    tags: ["Event Strategy", "Luxury Hospitality", "Client Relations"],
    recommended: true
  }
];

export const COCKTAILS: Cocktail[] = [
  {
    id: "velvet-burn",
    name: "Velvet Burn",
    colorTemp: "#2d0e08",
    bgGradient: "linear-gradient(135deg, #1f0b06 0%, #3d120a 60%, #c9a84c 100%)",
    flavorPills: ["DEEP", "ESPRESSO-TONED", "QUIETLY BOLD"],
    tastingNote: "A deep, espresso-toned cocktail with a smooth, controlled bitterness. Finished with a soft foam - balanced, refined, and quietly bold.",
    ingredients: [
      { name: "Vodka", role: "45 ml" },
      { name: "Coffee Liqueur", role: "30 ml" },
      { name: "Fresh Espresso", role: "30 ml" },
      { name: "Simple Syrup", role: "15 ml" },
      { name: "Chocolate Bitters", role: "2 dashes" }
    ],
    placeholderPhoto: "1000116690.jpg",
    textColor: "text-amber-50",
    accentColor: "#c9a84c",
    imageSrc: "/velvet_burn.jpeg",
    videoSrc: "/velvet_burn.mp4",
    glass: "Coupe",
    method: [
      "Add all ingredients to a shaker with ice.",
      "Shake hard for 15 seconds.",
      "Double strain into a chilled coupe glass.",
      "Garnish with 3 coffee beans."
    ]
  },
  {
    id: "split-state",
    name: "Split State",
    colorTemp: "#0d1a2e",
    bgGradient: "linear-gradient(135deg, #07111f 0%, #172a45 60%, #d4a830 100%)",
    flavorPills: ["LAYERED", "COMPLEX", "CONVERSATION STARTER"],
    tastingNote: "A visually layered cocktail with contrast in both tone and taste. Light on the surface, complex underneath – designed to start conversations.",
    ingredients: [
      { name: "Green Chartreuse (Bottom)", role: "30 ml" },
      { name: "Lime Juice (Bottom)", role: "20 ml" },
      { name: "Simple Syrup (Bottom)", role: "10 ml" },
      { name: "Gin (Top Layer)", role: "45 ml" },
      { name: "Elderflower Syrup (Top)", role: "20 ml" },
      { name: "Lemon Juice (Top)", role: "20 ml" },
      { name: "Soda Water", role: "Top up" }
    ],
    placeholderPhoto: "1000116699.webp",
    textColor: "text-blue-50",
    accentColor: "#d4a830",
    imageSrc: "/split_state.jpeg",
    videoSrc: "/split_state.mp4",
    glass: "Collins / Highball",
    method: [
      "Add bottom layer ingredients to a glass with ice. Stir well.",
      "Slowly pour the top layer over the back of a spoon to float.",
      "Garnish with citrus slice."
    ]
  },
  {
    id: "garden-silence",
    name: "Garden Silence",
    colorTemp: "#0d1f10",
    bgGradient: "linear-gradient(135deg, #051207 0%, #122915 60%, #c8b87a 100%)",
    flavorPills: ["FLORAL", "TEXTURED", "DESSERT-LIKE"],
    tastingNote: "Soft, textured, almost dessert-like. Subtle floral notes with a calm, rounded finish.",
    ingredients: [
      { name: "White Rum", role: "45 ml" },
      { name: "Coconut Cream", role: "30 ml" },
      { name: "Lychee Liqueur", role: "20 ml" },
      { name: "Lime Juice", role: "15 ml" },
      { name: "Vanilla Syrup", role: "10 ml" }
    ],
    placeholderPhoto: "1000116703.webp",
    textColor: "text-emerald-50",
    accentColor: "#c8b87a",
    isSpecialImage: true,
    imageSrc: "/garden_silence.jpeg",
    videoSrc: "/garden_silence.mp4",
    glass: "Coupe",
    method: [
      "Add all ingredients to a shaker with ice.",
      "Shake until well chilled.",
      "Double strain into a chilled coupe glass.",
      "Garnish with edible flowers or baby's breath."
    ]
  },
  {
    id: "cut-glass",
    name: "Cut Glass",
    colorTemp: "#111111",
    bgGradient: "linear-gradient(135deg, #0a0908 0%, #1d1b18 60%, #e8dfc8 100%)",
    flavorPills: ["SPIRIT-FORWARD", "PRECISE", "UNCOMPROMISING"],
    tastingNote: "Spirit-forward and minimal. Built on clarity, balance, and precision.",
    ingredients: [
      { name: "Bourbon / Rye Whiskey", role: "60 ml" },
      { name: "Honey Syrup", role: "15 ml" },
      { name: "Aromatic Bitters", role: "2 dashes" },
      { name: "Jalapeño Slice", role: "1 slice (optional)" }
    ],
    placeholderPhoto: "1000116690.jpg",
    textColor: "text-neutral-50",
    accentColor: "#e8dfc8",
    imageSrc: "/cut_glass.jpeg",
    videoSrc: "/cut_glass.mp4",
    glass: "Rocks",
    method: [
      "Add all ingredients to a mixing glass with ice.",
      "Stir for 20-25 seconds until well chilled.",
      "Strain over a large clear ice cube in a rocks glass.",
      "Garnish with a jalapeño slice."
    ]
  }
];

export const CERTIFICATIONS = [
  { name: "Spirits Production", highlighted: false },
  { name: "Scotch Whisky", highlighted: false },
  { name: "Gin Botanicals & Terroir", highlighted: true },
  { name: "Rum Heritage", highlighted: false },
  { name: "Vodka & White Spirits", highlighted: false },
  { name: "Tequila & Mezcal", highlighted: false },
  { name: "Cocktail Craftsmanship", highlighted: false },
  { name: "Menu Engineering", highlighted: true },
  { name: "Brand Advocacy", highlighted: true },
  { name: "Bar Management", highlighted: false },
  { name: "Consumer Psychology", highlighted: true },
  { name: "Responsible Service", highlighted: false },
  { name: "Luxury Brand Serves", highlighted: false },
  { name: "Flavour Profiling", highlighted: false },
  { name: "Precision Garnishing", highlighted: false }
];

export const SKILLS: SkillItem[] = [
  { name: "Menu Engineering", percentage: 96 },
  { name: "Brand Storytelling", percentage: 95 },
  { name: "Category Knowledge", percentage: 94 },
  { name: "Event Curation", percentage: 88 },
  { name: "Public Speaking", percentage: 86 },
  { name: "Team Leadership", percentage: 85 },
  { name: "Content Strategy", percentage: 80 }
];

export const DIAGEO_CERTIFICATES = [
  {
    id: "serve-recommend-skill",
    title: "SERVING & RECOMMENDING WITH SKILL",
    date: "02/05/26",
    type: "Service Strategy",
    verificationId: "DBA-SRS-9626"
  },
  {
    id: "perfect-serve-cocktails",
    title: "THE PERFECT SERVE WITH SIMPLE COCKTAILS",
    date: "01/05/26",
    type: "Cocktail Engineering",
    verificationId: "DBA-PSC-1026"
  },
  {
    id: "serve-with-spirit",
    title: "SERVE WITH SPIRIT",
    date: "23/09/24",
    type: "Spirits Mastery",
    isOnlineCourse: true,
    verificationId: "DBA-SWS-2324"
  },
  {
    id: "beer-essentials",
    title: "BEER ESSENTIALS",
    date: "01/05/26",
    type: "Fermentation Craft",
    verificationId: "DBA-BEE-0126"
  },
  {
    id: "diageo-bar-academy-essentials",
    title: "DIAGEO BAR ACADEMY ESSENTIALS",
    date: "30/04/26",
    type: "Industry Excellence",
    verificationId: "DBA-DAE-3026"
  }
];

