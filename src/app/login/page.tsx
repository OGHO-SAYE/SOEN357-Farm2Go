import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>
        <div className="grid gap-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/consumer">Login as Consumer</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/farmer">Login as Farmer</Link>
          </Button>
        </div>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
