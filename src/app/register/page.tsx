import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Choose your account type to get started
          </p>
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Consumer Account</h2>
              <p className="text-sm text-muted-foreground">
                Shop for fresh, local produce from nearby farms
              </p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/register/consumer">Register as Consumer</Link>
            </Button>
          </div>
          <div className="rounded-lg border p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Farmer Account</h2>
              <p className="text-sm text-muted-foreground">
                Sell your farm products directly to local consumers
              </p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/register/farmer">Register as Farmer</Link>
            </Button>
          </div>
        </div>
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
