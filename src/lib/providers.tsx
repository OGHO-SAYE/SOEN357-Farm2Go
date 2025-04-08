"use client";

import React from "react";
import { CartProvider } from "@/lib/context/cart-context";
import { Navbar } from "@/components/layout/navbar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </CartProvider>
  );
}
