import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Clear the auth session cookie (typically next-auth.session-token or similar)
  const cookieStore = await cookies();

  // You may need to clear multiple cookies depending on your session strategy
  cookieStore.delete("next-auth.session-token"); // For default session
  cookieStore.delete("next-auth.csrf-token");
  cookieStore.delete("__Secure-next-auth.session-token"); // For secure cookies
  cookieStore.delete("__Host-next-auth.csrf-token");

  console.log("User logged out — session cleared");

  // Redirect to login
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXTAUTH_URL));
}
