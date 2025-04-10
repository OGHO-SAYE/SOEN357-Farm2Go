import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, farmers } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// GET handler to retrieve all farmers
export async function GET(request: NextRequest) {
  try {
    // Join the users and farmers tables to get all farmer information
    const allFarmers = await db
      .select({
        id: farmers.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        farmName: farmers.farmName,
        farmDescription: farmers.farmDescription,
        farmAddress: farmers.farmAddress,
        city: farmers.city,
        state: farmers.state,
        postalCode: farmers.postalCode,
        phoneNumber: farmers.phoneNumber,
        isOrganic: farmers.isOrganic,
        isNonGMO: farmers.isNonGMO,
        isSustainable: farmers.isSustainable,
        isPastureRaised: farmers.isPastureRaised,
      })
      .from(farmers)
      .innerJoin(users, eq(farmers.id, users.id))
      .orderBy(desc(users.createdAt));

    return NextResponse.json(allFarmers);
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return NextResponse.json(
      { error: "Failed to fetch farmers" },
      { status: 500 }
    );
  }
}
