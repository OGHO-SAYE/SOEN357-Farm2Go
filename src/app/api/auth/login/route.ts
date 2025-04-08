import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth/service";
import { LoginData, UserType } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userType = formData.get("userType") as UserType;
    if (!userType || (userType !== "consumer" && userType !== "farmer")) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    const loginData: LoginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      userType,
    };

    // Validate required fields
    if (!loginData.email || !loginData.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await loginUser(loginData);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set cookies
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
    });

    // Set cookies with user information
    response.cookies.set("userId", user.id);
    response.cookies.set("userEmail", user.email);
    response.cookies.set("userFirstName", user.firstName);
    response.cookies.set("userLastName", user.lastName);
    response.cookies.set("userType", user.userType);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
