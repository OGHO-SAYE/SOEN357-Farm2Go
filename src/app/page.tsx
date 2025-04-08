import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="z-10 max-w-5xl w-full items-center flex flex-col">
        <div className="text-center bg-accent/40 p-8 rounded-xl border border-secondary mb-12 w-full">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Farm2Go
          </h1>
          <p className="text-lg text-accent-foreground mb-8">
            Your farm-to-table marketplace connecting local farmers with
            conscious consumers. Browse fresh produce, dairy, and more directly
            from farms in your area.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-brown text-brown hover:bg-brown hover:text-wheat"
            >
              <Link href="/farmers">Meet Our Farmers</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white p-6 rounded-lg border border-muted shadow-sm">
            <div className="text-gold mb-3 text-xl">★</div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Fresh & Local
            </h2>
            <p className="text-foreground">
              All products are sourced directly from local farms, ensuring
              maximum freshness and supporting your local economy.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-muted shadow-sm">
            <div className="text-gold mb-3 text-xl">★</div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Sustainable Farming
            </h2>
            <p className="text-foreground">
              Our farmers use sustainable practices that are better for the
              environment and produce healthier food.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-muted shadow-sm">
            <div className="text-gold mb-3 text-xl">★</div>
            <h2 className="text-xl font-semibold text-primary mb-2">
              Know Your Farmer
            </h2>
            <p className="text-foreground">
              Connect directly with the people who grow your food. Learn about
              their farming practices and values.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
