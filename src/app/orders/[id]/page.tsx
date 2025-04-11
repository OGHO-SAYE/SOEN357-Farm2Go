"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Clock,
  Package,
  CheckCircle,
  Truck,
  AlertCircle,
  ArrowLeft,
  MapPin,
  CalendarDays,
  Receipt,
  BadgeCheck,
  Leaf,
  CircleSlash,
  Globe,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  farmerId: string;
  farmerName: string;
};

type Order = {
  id: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from localStorage
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    // Redirect to login if no user ID
    if (!userId) {
      router.push("/login");
      return;
    }

    if (orderId) {
      fetchOrderDetails();
    }
  }, [userId, orderId, router]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setError(null);
      } else {
        setError("Failed to fetch order details. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
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

  const getStatusSteps = (status: Order["status"]) => {
    const steps = [
      { label: "Order Placed", icon: <Package />, completed: true },
      {
        label: "Processing",
        icon: <Clock />,
        completed: status !== "pending",
      },
      {
        label: "Shipped",
        icon: <Truck />,
        completed: status === "completed",
      },
      {
        label: "Delivered",
        icon: <CheckCircle />,
        completed: status === "completed",
      },
    ];

    if (status === "cancelled") {
      return [
        { label: "Order Placed", icon: <Package />, completed: true },
        { label: "Cancelled", icon: <AlertCircle />, completed: true },
      ];
    }

    return steps;
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-accent-foreground">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Show error message if there was an issue
  if (error || !order) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Order Details</h1>
        </div>

        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-red-700">
            {error || "Order not found. Please go back and try again."}
          </p>
        </div>

        <Button asChild>
          <Link href="/orders">Go Back to Orders</Link>
        </Button>
      </div>
    );
  }

  // Format the created date
  const orderDate = format(
    parseISO(order.createdAt),
    "MMMM d, yyyy 'at' h:mm a"
  );

  // For demo purposes - in a real app, these would come from the API
  // Showing mock data since we don't have these fields in the API yet
  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="mr-4" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-primary">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary Section */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order.id.substring(0, 8)}...</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    {orderDate}
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

            <CardContent>
              {/* Order Status Tracker */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-4">Order Status</h3>
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {React.cloneElement(step.icon as React.ReactElement, {
                          className: "h-5 w-5",
                        })}
                      </div>
                      <div className="text-xs mt-2 text-center">
                        {step.label}
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute h-0.5 w-[60px] translate-x-[40px] mt-5 ${
                            step.completed ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                <div className="bg-muted/30 p-3 rounded-md flex items-start">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                  <div className="text-sm">
                    <p>{order.shippingAddress}</p>
                    <p>
                      {order.shippingCity}, {order.shippingState}{" "}
                      {order.shippingPostalCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <h3 className="text-sm font-medium mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Farm</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items &&
                    order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell>{item.farmerName}</TableCell>
                        <TableCell className="text-right">
                          ${item.pricePerUnit.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.pricePerUnit * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-muted pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button className="w-full" variant="outline" asChild>
                <a
                  href={`mailto:support@farm2go.com?subject=Help with Order ${order.id.substring(
                    0,
                    8
                  )}`}
                >
                  Contact Support
                </a>
              </Button>
              {order.status === "pending" && (
                <Button className="w-full" variant="destructive">
                  Cancel Order
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
