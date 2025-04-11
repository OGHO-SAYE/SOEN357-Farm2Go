"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  BarChart3,
  LineChart,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";

// Types for dashboard data
type Farmer = {
  id: string;
  firstName: string;
  lastName: string;
  farmName: string;
};

type Summary = {
  totalRevenue: number;
  ordersCount: number;
  totalProductCount: number;
  lowStockCount: number;
  period: number;
};

type DailyRevenue = {
  date: string;
  amount: number;
};

type TopProduct = {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
};

type RecentOrder = {
  orderId: string;
  date: string;
  total: number;
  status: string;
  customerName: string;
};

type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
  unit: string;
};

type DashboardData = {
  farmer: Farmer;
  summary: Summary;
  dailyRevenue: DailyRevenue[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
  inventory: InventoryItem[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [period, setPeriod] = useState("30");

  // Get farmer ID from localStorage
  const farmerId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;

  useEffect(() => {
    // Check if user is a farmer
    if (userType !== "farmer") {
      router.push("/");
      return;
    }

    if (farmerId) {
      fetchDashboardData();
    } else {
      router.push("/login");
    }
  }, [farmerId, period, router, userType]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/dashboard?farmerId=${farmerId}&period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not authenticated or data is loading, show loading state
  if (isLoading || !dashboardData) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-accent-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {dashboardData.farmer.farmName} Dashboard
          </h1>
          <p className="text-accent-foreground">
            Welcome back, {dashboardData.farmer.firstName}{" "}
            {dashboardData.farmer.lastName}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center">
          <span className="text-sm text-muted-foreground mr-2">
            Time period:
          </span>
          <Select
            value={period}
            onValueChange={(value: string) => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue>
                {period ? `Last ${period} days` : "Select period"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-primary" />
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardData.summary.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {dashboardData.summary.period} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShoppingCart className="h-4 w-4 mr-1 text-primary" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.summary.ordersCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {dashboardData.summary.period} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-4 w-4 mr-1 text-primary" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.summary.totalProductCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total active products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.summary.lowStockCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Products with &lt; 5 items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <LineChart className="h-4 w-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-1" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Recent Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Your daily revenue for the last {dashboardData.summary.period}{" "}
                days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-md flex justify-center items-center">
                {dashboardData.dailyRevenue.length > 0 ? (
                  <p className="text-muted-foreground">
                    Revenue data available - Chart visualization would be
                    implemented here with a chart library
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    No revenue data available for the selected period
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>
                Your best performing products by quantity sold
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.topProducts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.topProducts.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell className="font-medium">
                          {product.productName}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.totalSold}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(product.totalRevenue))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No sales data available for the selected period
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.price)}
                      </TableCell>
                      <TableCell className="text-right">{item.stock}</TableCell>
                      <TableCell className="text-right">{item.unit}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.stock === 0
                              ? "bg-red-100 text-red-800"
                              : item.stock < 5
                              ? "bg-amber-100 text-amber-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.stock === 0
                            ? "Out of stock"
                            : item.stock < 5
                            ? "Low stock"
                            : "In stock"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="mr-2" asChild>
                <a href="/products/add">Add New Product</a>
              </Button>
              <Button variant="outline">Update Inventory</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Your most recent customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recentOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-medium">
                          {order.orderId.substring(0, 8)}...
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>
                          {format(parseISO(order.date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Number(order.total))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    No recent orders found
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href="/orders">View All Orders</a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
