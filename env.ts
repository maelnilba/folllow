import env from "env-var";

export const GITHUB_ID = env.get("GITHUB_ID").required().asString();
export const GITHUB_SECRET = env.get("GITHUB_SECRET").required().asString();
export const GOOGLE_CLIENT_ID = env
  .get("GOOGLE_CLIENT_ID")
  .required()
  .asString();
export const GOOGLE_CLIENT_SECRET = env
  .get("GOOGLE_CLIENT_SECRET")
  .required()
  .asString();
export const TWITTER_CLIENT_ID = env
  .get("TWITTER_CLIENT_ID")
  .required()
  .asString();
export const TWITTER_CLIENT_SECRET = env
  .get("TWITTER_CLIENT_SECRET")
  .required()
  .asString();
export const DISCORD_CLIENT_ID = env
  .get("DISCORD_CLIENT_ID")
  .required()
  .asString();
export const DISCORD_CLIENT_SECRET = env
  .get("DISCORD_CLIENT_SECRET")
  .required()
  .asString();
