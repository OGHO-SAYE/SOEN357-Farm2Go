import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Create response with redirect to homepage
  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear all user cookies
  response.cookies.delete("userId");
  response.cookies.delete("userEmail");
  response.cookies.delete("userFirstName");
  response.cookies.delete("userLastName");
  response.cookies.delete("userType");

  return response;
}
