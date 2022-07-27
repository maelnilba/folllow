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

export const APP_AWS_ACCESS_KEY = env
  .get("APP_AWS_ACCESS_KEY")
  .required()
  .asString();
export const APP_AWS_SECRET_KEY = env
  .get("APP_AWS_SECRET_KEY")
  .required()
  .asString();
export const APP_AWS_REGION = env.get("APP_AWS_REGION").required().asString();
export const AWS_S3_BUCKET_NAME = env
  .get("AWS_S3_BUCKET_NAME")
  .required()
  .asString();
export const STRIPE_CLIENT_SECRET = env
  .get("STRIPE_CLIENT_SECRET")
  .required()
  .asString();
