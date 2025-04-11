"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Package,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import Link from "next/link";

type Order = {
  id: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from localStorage
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const userFirstName =
    typeof window !== "undefined"
      ? localStorage.getItem("userFirstName") || "Guest"
      : "Guest";

  useEffect(() => {
    // Redirect to login if no user ID
    if (!userId) {
      router.push("/login");
      return;
    }

    fetchOrders();
  }, [userId, router]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/checkout?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setError(null);
      } else {
        setError("Failed to fetch orders. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "processing":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Order received, awaiting processing";
      case "processing":
        return "Your order is being prepared by the farmers";
      case "completed":
        return "Your order has been delivered";
      case "cancelled":
        return "This order was cancelled";
      default:
        return "Unknown status";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-accent-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-primary">Your Orders</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-background rounded-lg p-8 text-center border border-muted">
          <div className="mb-4 flex justify-center">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Browse our products and start
            shopping!
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.substring(0, 8)}...
                    </CardTitle>
                    <CardDescription>
                      Placed on{" "}
                      {format(
                        parseISO(order.createdAt),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    {getStatusIcon(order.status)}
                    <span className="ml-2 font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center py-2 text-sm">
                    <div className="flex-grow border-t border-muted mr-2"></div>
                    <span className="text-muted-foreground flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2">
                        {getStatusText(order.status)}
                      </span>
                    </span>
                    <div className="flex-grow border-t border-muted ml-2"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 pt-4">
                <div className="w-full flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order.id}`}>View Order Details</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
