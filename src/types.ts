export interface Venue {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  recommended?: boolean;
}

export interface Cocktail {
  id: string;
  name: string;
  colorTemp: string; // inline styles for CSS color temperatures (e.g., gradient)
  bgGradient: string; // CSS-compatible gradient string
  flavorPills: string[];
  tastingNote: string;
  ingredients: {
    name: string;
    role: string;
  }[];
  placeholderPhoto: string; // standard filename label required: 1000116690.jpg, 1000116699.webp, etc.
  textColor: string; // text tone adjustment for accessibility
  accentColor: string; // matching gold / light sand color
  isSpecialImage?: boolean; // if we display dropper or other asset
  imageSrc?: string; // path to the user's uploaded images
  method?: string[]; // exact instructions to build the drink
  glass?: string; // the recommended drinkware
  videoSrc?: string; // path to optional uploaded MP4 video for the drink
}

export interface SkillItem {
  name: string;
  percentage: number;
}
