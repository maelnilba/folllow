export interface SocialMediaLink {
  id: number;
  media: typeof SocialMedias[number];
  url: string;
}
export type SocialMedia = typeof SocialMedias[number];

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
] as const;

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
