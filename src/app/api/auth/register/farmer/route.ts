import { NextRequest, NextResponse } from "next/server";
import { registerFarmer } from "@/lib/auth/service";
import { RegisterFarmerData } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userData: RegisterFarmerData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      farmName: formData.get("farmName") as string,
      farmDescription: formData.get("farmDescription") as string,
      farmAddress: formData.get("farmAddress") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      isOrganic: formData.get("isOrganic") === "true",
      isNonGMO: formData.get("isNonGMO") === "true",
      isSustainable: formData.get("isSustainable") === "true",
      isPastureRaised: formData.get("isPastureRaised") === "true",
    };

    // Validate required fields
    const requiredFields = [
      "email",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "farmName",
      "farmAddress",
      "city",
      "state",
      "postalCode",
      "phoneNumber",
    ];

    for (const field of requiredFields) {
      if (!userData[field as keyof RegisterFarmerData]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate password match
    if (userData.password !== userData.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const user = await registerFarmer(userData);

    if (!user) {
      return NextResponse.json(
        { error: "Error creating account" },
        { status: 500 }
      );
    }

    // Redirect to login page on success
    return NextResponse.redirect(new URL("/login/farmer", request.url));
  } catch (error) {
    console.error("Farmer registration error:", error);

    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
