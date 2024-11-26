// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// export const config = { matcher: [ "/","/sign-in","/home"] };
// export async function middleware(request: NextRequest) {
//     console.log("middleware triggered for: ", request.nextUrl.pathname);
//     const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
//     if (!token) {
//     console.log("No token found in middleware.");
//     return NextResponse.next();
//   }

//   console.log("Middleware Token Content:", token);
//     const url = request.nextUrl;
//     console.log("from middleware ", token?._id);
//     if (token) {
//         return NextResponse.redirect(new URL("/home", request.url));
//     }
    
//     return NextResponse.next();
// }
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// export const config = {
//   matcher: ["/", "/home*", "/sign-in", "/protected*"] // Adjust to match all protected routes
// };
export const config = {
    matcher: ["/:path*"],
};

export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.nextUrl.pathname);
  const recieved = cookies();
  console.log((await recieved).get("access_token"));
  // // Fetch token from the request
  // const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // if (!token) {
  //   console.log("No token found. Redirecting to /sign-in.");
  //   // Redirect unauthenticated users to /sign-in
  //   const url = new URL("/dbcheck", request.url);
  //   return NextResponse.redirect(url);
  // }

  // console.log("Token found. User ID:", token._id); // Log the user ID or token info
  // Allow authenticated users to proceed
  return NextResponse.next();
}
