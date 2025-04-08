import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FarmerRegisterPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Farmer Registration</h1>
          <p className="text-muted-foreground mt-2">
            Create an account to list and sell your farm products
          </p>
        </div>
        <form
          className="space-y-4"
          action="/api/auth/register/farmer"
          method="POST"
        >
          {/* Personal Information */}
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="font-medium">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phoneNumber"
                type="tel"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          {/* Farm Information */}
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="font-medium">Farm Information</h2>
            <div className="space-y-2">
              <label htmlFor="farmName" className="text-sm font-medium">
                Farm Name
              </label>
              <input
                id="farmName"
                name="farmName"
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your farm name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="farmDescription" className="text-sm font-medium">
                Farm Description
              </label>
              <textarea
                id="farmDescription"
                name="farmDescription"
                className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                placeholder="Describe your farm, practices, and specialties"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="farmAddress" className="text-sm font-medium">
                Farm Address
              </label>
              <input
                id="farmAddress"
                name="farmAddress"
                type="text"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your farm address"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="City"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">
                  State/Province
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="State/Province"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="Postal Code"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Farm Certifications (optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="organic"
                    name="isOrganic"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    value="true"
                  />
                  <label htmlFor="organic" className="text-sm">
                    Organic
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="nonGMO"
                    name="isNonGMO"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    value="true"
                  />
                  <label htmlFor="nonGMO" className="text-sm">
                    Non-GMO
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="sustainable"
                    name="isSustainable"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    value="true"
                  />
                  <label htmlFor="sustainable" className="text-sm">
                    Sustainable
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="pastureRaised"
                    name="isPastureRaised"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    value="true"
                  />
                  <label htmlFor="pastureRaised" className="text-sm">
                    Pasture Raised
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              required
            />
            <label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full">
            Create Farmer Account
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
