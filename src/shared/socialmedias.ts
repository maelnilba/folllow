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
