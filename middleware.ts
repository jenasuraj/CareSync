import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("i am in middleware...");
  const token = req.cookies?.get("token")?.value;
  const gtoken = req.cookies.get("__Secure-next-auth.session-token")?.value || req.cookies.get("next-auth.session-token")?.value;
  const admin_token = req.cookies?.get("admin_token")?.value;
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/", "/login"];


if(token || gtoken){
  if (publicRoutes.includes(pathname) ||  pathname == '/dashboard') {
    return NextResponse.redirect(new URL("/dashboard/patient", req.url));
  }
   if(pathname.startsWith('/dashboard/admin')){
    return NextResponse.redirect(new URL("/dashboard/patient", req.url));
  }
}

else if(admin_token){
  if (publicRoutes.includes(pathname) || pathname == '/dashboard') {
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }
  if(pathname.startsWith('/dashboard/patient')){
    return NextResponse.redirect(new URL("/dashboard/admin", req.url));
  }
}
  
if (!token && !gtoken && !admin_token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",               
    "/login",     
    "/dashboard/:path*",
  ],
};