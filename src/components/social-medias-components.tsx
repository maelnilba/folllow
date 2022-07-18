import {
  faDeviantart,
  faDiscord,
  faFacebook,
  faFlickr,
  faGithub,
  faInstagram,
  faLinkedin,
  faPatreon,
  faPinterest,
  faSnapchat,
  faSoundcloud,
  faSpotify,
  faTiktok,
  faTumblr,
  faTwitch,
  faTwitter,
  faVimeo,
  faYoutube,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useMemo } from "react";
import { SocialMedia } from "utils/shared";

export type SocialMediasType = readonly {
  handle: SocialMedia;
  name: string;
  icon: IconDefinition;
}[];

export const SocialMediasComponents: SocialMediasType = [
  {
    handle: "twitter",
    name: "Twitter",
    icon: faTwitter,
  },
  {
    handle: "twitch",
    name: "Twitch",
    icon: faTwitch,
  },
  {
    handle: "facebook",
    name: "Facebook",
    icon: faFacebook,
  },
  {
    handle: "onlyfans",
    name: "Onlyfans",
    icon: faLink,
  },
  {
    handle: "mym",
    name: "Mym",
    icon: faLink,
  },
  {
    handle: "youtube",
    name: "YouTube",
    icon: faYoutube,
  },
  {
    handle: "patreon",
    name: "Patreon",
    icon: faPatreon,
  },
  {
    handle: "vimeo",
    name: "Vimeo",
    icon: faVimeo,
  },
  {
    handle: "tiktok",
    name: "TikTok",
    icon: faTiktok,
  },
  {
    handle: "instagram",
    name: "Instagram",
    icon: faInstagram,
  },
  {
    handle: "tumblr",
    name: "Tumblr",
    icon: faTumblr,
  },
  {
    handle: "snapchat",
    name: "Snapchat",
    icon: faSnapchat,
  },
  {
    handle: "pinterest",
    name: "Pinterest",
    icon: faPinterest,
  },
  {
    handle: "linkedin",
    name: "Linkedin",
    icon: faLinkedin,
  },
  {
    handle: "indeed",
    name: "Indeed",
    icon: faLink,
  },
  {
    handle: "deviantart",
    name: "DevianArt",
    icon: faDeviantart,
  },
  {
    handle: "flickr",
    name: "Flickr",
    icon: faFlickr,
  },
  {
    handle: "discord",
    name: "Discord",
    icon: faDiscord,
  },
  {
    handle: "wattpad",
    name: "Wattpad",
    icon: faLink,
  },
  {
    handle: "soundcloud",
    name: "Soundcloud",
    icon: faSoundcloud,
  },
  {
    handle: "spotify",
    name: "Spotify",
    icon: faSpotify,
  },
  {
    handle: "github",
    name: "GitHub",
    icon: faGithub,
  },
] as const;

interface SocialMediaIconProps {
  media: SocialMedia;
  className?: string;
  iconClassName?: string;
}
export const SocialMediaComponent = memo((props: SocialMediaIconProps) => {
  const media = useMemo(
    () =>
      SocialMediasComponents.find((media) => media.handle === props.media) || {
        icon: faLink,
        handle: "custom",
        name: "Custom",
      },
    [props]
  );
  return (
    <div className={props.className}>
      <FontAwesomeIcon icon={media.icon} className={props.iconClassName} />
      <p>{media.name}</p>
    </div>
  );
});
