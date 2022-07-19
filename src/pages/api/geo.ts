import type { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const geo = req.geo;
  return new Response(JSON.stringify(geo), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
