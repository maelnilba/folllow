export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// export const config = { matcher: ["/dashboard", "/dashboard/:path*"] };

// export async function middleware(req: NextRequest) {
//   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   if (!session) {
//     const signInUrl = new URL("/sign-in", req.url);
//     signInUrl.searchParams.set("from", req.nextUrl.pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }

export const config = { matcher: ["/dashboard", "/dashboard/:path*"] };
