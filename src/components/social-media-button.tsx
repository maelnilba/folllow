import {
  faDeviantart,
  faDiscord,
  faFacebook,
  faFlickr,
  faInstagram,
  faLinkedin,
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
import { SocialMedia } from "utils/shared";

interface SocialMediaButtonProps {
  media: SocialMedia;
}

export const SocialMediaButton: React.FC<SocialMediaButtonProps> = (props) => {
  const media = SocialMediasComponents[props.media];
  return (
    <div className="btn gap-2">
      <FontAwesomeIcon icon={media.icon} />
      {media.name}
    </div>
  );
};

type SocialMediasType = {
  [key in SocialMedia]: {
    name: string;
    icon: IconDefinition;
  };
};

const SocialMediasComponents: SocialMediasType = {
  twitter: {
    name: "Twitter",
    icon: faTwitter,
  },
  twitch: {
    name: "Twitch",
    icon: faTwitch,
  },
  facebook: {
    name: "Facebook",
    icon: faFacebook,
  },
  onlyfans: {
    name: "Onlyfans",
    icon: faLink,
  },
  mym: {
    name: "Mym",
    icon: faLink,
  },
  youtube: {
    name: "YouTube",
    icon: faYoutube,
  },
  vimeo: {
    name: "Vimeo",
    icon: faVimeo,
  },
  tiktok: {
    name: "TikTok",
    icon: faTiktok,
  },
  instagram: {
    name: "Instagram",
    icon: faInstagram,
  },
  tumblr: {
    name: "Tumblr",
    icon: faTumblr,
  },
  snapchat: {
    name: "Snapchat",
    icon: faSnapchat,
  },
  pinterest: {
    name: "Pinterest",
    icon: faPinterest,
  },
  linkedin: {
    name: "Linkedin",
    icon: faLinkedin,
  },
  indeed: {
    name: "Indeed",
    icon: faLink,
  },
  deviantart: {
    name: "DevianArt",
    icon: faDeviantart,
  },
  flickr: {
    name: "Flickr",
    icon: faFlickr,
  },
  discord: {
    name: "Discord",
    icon: faDiscord,
  },
  wattpad: {
    name: "Wattpad",
    icon: faLink,
  },
  soundcloud: {
    name: "Soundcloud",
    icon: faSoundcloud,
  },
  spotify: {
    name: "Spotify",
    icon: faSpotify,
  },
};
