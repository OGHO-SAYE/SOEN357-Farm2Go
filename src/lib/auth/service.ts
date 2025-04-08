import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { users, consumers, farmers } from "../db/schema";
import {
  RegisterConsumerData,
  RegisterFarmerData,
  LoginData,
  Consumer,
  Farmer,
  User,
} from "./types";
import { eq } from "drizzle-orm";

// Mock hashing function (in a real app, use bcrypt)
const hashPassword = (password: string): string => {
  // In production: return bcrypt.hashSync(password, 10)
  return `hashed_${password}`;
};

// Mock compare function (in a real app, use bcrypt)
const comparePasswords = (password: string, hash: string): boolean => {
  // In production: return bcrypt.compareSync(password, hash)
  return hash === `hashed_${password}`;
};

export async function registerConsumer(
  data: RegisterConsumerData
): Promise<Consumer | null> {
  try {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .get();
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = uuidv4();
    const now = new Date().toISOString();

    // Create base user
    await db.insert(users).values({
      id: userId,
      email: data.email,
      passwordHash: hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      userType: "consumer",
      createdAt: now,
    });

    // Create consumer profile
    await db.insert(consumers).values({
      id: userId,
    });

    // Return the newly created user
    return {
      id: userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      userType: "consumer",
      createdAt: now,
    };
  } catch (error) {
    console.error("Error registering consumer:", error);
    return null;
  }
}

export async function registerFarmer(
  data: RegisterFarmerData
): Promise<Farmer | null> {
  try {
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .get();
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const userId = uuidv4();
    const now = new Date().toISOString();

    // Create base user
    await db.insert(users).values({
      id: userId,
      email: data.email,
      passwordHash: hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      userType: "farmer",
      createdAt: now,
    });

    // Create farmer profile
    await db.insert(farmers).values({
      id: userId,
      farmName: data.farmName,
      farmDescription: data.farmDescription || "",
      farmAddress: data.farmAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      phoneNumber: data.phoneNumber,
      isOrganic: data.isOrganic || false,
      isNonGMO: data.isNonGMO || false,
      isSustainable: data.isSustainable || false,
      isPastureRaised: data.isPastureRaised || false,
    });

    // Return the newly created user
    return {
      id: userId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      userType: "farmer",
      createdAt: now,
      farmName: data.farmName,
      farmDescription: data.farmDescription,
      farmAddress: data.farmAddress,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      phoneNumber: data.phoneNumber,
      isOrganic: data.isOrganic || false,
      isNonGMO: data.isNonGMO || false,
      isSustainable: data.isSustainable || false,
      isPastureRaised: data.isPastureRaised || false,
    };
  } catch (error) {
    console.error("Error registering farmer:", error);
    return null;
  }
}

export async function loginUser(data: LoginData): Promise<User | null> {
  try {
    // Find the user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .get();

    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const passwordValid = comparePasswords(data.password, user.passwordHash);
    if (!passwordValid) {
      throw new Error("Invalid password");
    }

    // Verify user type matches
    if (user.userType !== data.userType) {
      throw new Error(`This account is not registered as a ${data.userType}`);
    }

    // Fetch additional details based on user type
    if (user.userType === "consumer") {
      const consumerInfo = await db
        .select()
        .from(consumers)
        .where(eq(consumers.id, user.id))
        .get();
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: "consumer",
        createdAt: user.createdAt,
        address: consumerInfo?.address || undefined,
        city: consumerInfo?.city || undefined,
        state: consumerInfo?.state || undefined,
        postalCode: consumerInfo?.postalCode || undefined,
        phoneNumber: consumerInfo?.phoneNumber || undefined,
      };
    } else if (user.userType === "farmer") {
      const farmerInfo = await db
        .select()
        .from(farmers)
        .where(eq(farmers.id, user.id))
        .get();
      if (!farmerInfo) {
        throw new Error("Farmer profile not found");
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: "farmer",
        createdAt: user.createdAt,
        farmName: farmerInfo.farmName,
        farmDescription: farmerInfo.farmDescription || undefined,
        farmAddress: farmerInfo.farmAddress,
        city: farmerInfo.city,
        state: farmerInfo.state,
        postalCode: farmerInfo.postalCode,
        phoneNumber: farmerInfo.phoneNumber,
        isOrganic: !!farmerInfo.isOrganic,
        isNonGMO: !!farmerInfo.isNonGMO,
        isSustainable: !!farmerInfo.isSustainable,
        isPastureRaised: !!farmerInfo.isPastureRaised,
      };
    }

    return null;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}
