import { NextRequest, NextResponse } from "next/server";
import { registerConsumer } from "@/lib/auth/service";
import { RegisterConsumerData } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userData: RegisterConsumerData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
    };

    // Validate required fields
    if (
      !userData.email ||
      !userData.password ||
      !userData.confirmPassword ||
      !userData.firstName ||
      !userData.lastName
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const user = await registerConsumer(userData);

    if (!user) {
      return NextResponse.json(
        { error: "Error creating account" },
        { status: 500 }
      );
    }

    // Redirect to login page on success
    return NextResponse.redirect(new URL("/login/consumer", request.url));
  } catch (error) {
    console.error("Consumer registration error:", error);

    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
