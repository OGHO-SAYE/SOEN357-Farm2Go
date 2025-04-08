// User type definitions
export type UserType = "consumer" | "farmer";

export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  createdAt: string;
}

export interface Consumer extends BaseUser {
  userType: "consumer";
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phoneNumber?: string;
}

export interface Farmer extends BaseUser {
  userType: "farmer";
  farmName: string;
  farmDescription?: string;
  farmAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  isOrganic: boolean;
  isNonGMO: boolean;
  isSustainable: boolean;
  isPastureRaised: boolean;
}

export type User = Consumer | Farmer;

// Authentication related types
export interface RegisterConsumerData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RegisterFarmerData extends RegisterConsumerData {
  farmName: string;
  farmDescription?: string;
  farmAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  isOrganic?: boolean;
  isNonGMO?: boolean;
  isSustainable?: boolean;
  isPastureRaised?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  userType: UserType;
}
