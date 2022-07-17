export const SocialMedias = [
  "twitter",
  "twitch",
  "facebook",
  "onlyfans",
  "mym",
  "youtube",
  "vimeo",
  "tiktok",
  "instagram",
  "tumblr",
  "snapchat",
  "pinterest",
  "linkedin",
  "indeed",
  "deviantart",
  "flickr",
  "discord",
  "wattpad",
  "soundcloud",
  "spotify",
  "patreon",
  "github",
] as const;
export type SocialMedia = typeof SocialMedias[number];
export interface SocialMediaLink {
  id: string;
  position: number;
  media: SocialMedia;
  url: string;
}

export type Theme = typeof Themes[number];
export const Themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
] as const;
