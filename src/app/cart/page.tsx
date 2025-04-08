"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, itemCount, updateQuantity, removeItem, isLoading } = useCart();

  // Get user name from localStorage
  const userFirstName =
    typeof window !== "undefined"
      ? localStorage.getItem("userFirstName") || "Guest"
      : "Guest";

  // Calculate cart total
  const cartTotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Group items by farmer for better organization
  const itemsByFarmer: Record<string, typeof items> = {};
  items.forEach((item) => {
    const farmerName = item.product.farmerName || "Unknown Farm";
    if (!itemsByFarmer[farmerName]) {
      itemsByFarmer[farmerName] = [];
    }
    itemsByFarmer[farmerName].push(item);
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-primary mb-8">Your Cart</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading your cart...</p>
        </div>
      ) : itemCount === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center border border-muted">
          <div className="mb-4 flex justify-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Browse our fresh, locally-grown produce and add items to your cart.
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Cart Items */}
            {Object.entries(itemsByFarmer).map(([farmerName, farmerItems]) => (
              <div key={farmerName} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-accent-foreground">
                  {farmerName}
                </h3>
                <div className="bg-background rounded-lg border border-muted overflow-hidden">
                  {farmerItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && (
                        <div className="border-t border-muted"></div>
                      )}
                      <div className="p-4 flex items-center">
                        <div className="w-16 h-16 relative mr-4 overflow-hidden rounded-md shrink-0">
                          <Image
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)}/{item.product.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center border border-muted hover:bg-muted"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center border border-muted hover:bg-muted"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive text-sm inline-flex items-center mt-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-lg border border-muted p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal ({itemCount} items)
                  </span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-muted my-4 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full flex items-center justify-center">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="mt-6 text-center">
                <Link
                  href="/products"
                  className="text-sm text-primary hover:underline inline-flex items-center"
                >
                  <ShoppingCart className="mr-1 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
