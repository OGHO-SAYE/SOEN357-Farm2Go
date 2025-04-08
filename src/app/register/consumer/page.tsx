import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConsumerRegisterPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Consumer Registration</h1>
          <p className="text-muted-foreground mt-2">
            Create an account to shop for fresh local produce
          </p>
        </div>
        <form
          className="space-y-4"
          action="/api/auth/register/consumer"
          method="POST"
        >
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
            <label htmlFor="confirmPassword" className="text-sm font-medium">
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
            Create Account
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
