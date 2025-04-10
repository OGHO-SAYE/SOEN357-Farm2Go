import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  farmerRevenue,
  users,
  farmers,
  products,
  orderItems,
  orders,
  productAnalytics,
} from "@/lib/db/schema";
import {
  eq,
  and,
  sum,
  count,
  desc,
  max,
  min,
  avg,
  gte,
  lte,
  sql,
} from "drizzle-orm";
import { format, subDays, parseISO } from "date-fns";

// GET handler to retrieve dashboard data for a farmer
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("farmerId");
    const period = searchParams.get("period") || "30"; // Default to 30 days

    if (!farmerId) {
      return NextResponse.json(
        { error: "Farmer ID is required" },
        { status: 400 }
      );
    }

    // Calculate date range based on period
    const now = new Date();
    const startDate = format(subDays(now, parseInt(period)), "yyyy-MM-dd");
    const endDate = format(now, "yyyy-MM-dd");

    // Get farmer details
    const farmerDetails = await db
      .select({
        id: farmers.id,
        firstName: users.firstName,
        lastName: users.lastName,
        farmName: farmers.farmName,
      })
      .from(farmers)
      .innerJoin(users, eq(farmers.id, users.id))
      .where(eq(farmers.id, farmerId))
      .get();

    if (!farmerDetails) {
      return NextResponse.json({ error: "Farmer not found" }, { status: 404 });
    }

    // Get revenue data for the period
    const revenueData = await db
      .select({
        totalRevenue: sum(farmerRevenue.amount),
        ordersCount: count(farmerRevenue.orderId),
      })
      .from(farmerRevenue)
      .where(
        and(
          eq(farmerRevenue.farmerId, farmerId),
          gte(farmerRevenue.date, startDate),
          lte(farmerRevenue.date, endDate)
        )
      )
      .get();

    // Get daily revenue for chart
    const dailyRevenue = await db
      .select({
        date: farmerRevenue.date,
        amount: sum(farmerRevenue.amount),
      })
      .from(farmerRevenue)
      .where(
        and(
          eq(farmerRevenue.farmerId, farmerId),
          gte(farmerRevenue.date, startDate),
          lte(farmerRevenue.date, endDate)
        )
      )
      .groupBy(farmerRevenue.date)
      .orderBy(farmerRevenue.date)
      .all();

    // Get top selling products
    const topProducts = await db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        totalSold: sum(orderItems.quantity),
        totalRevenue: sql`SUM(${orderItems.quantity} * ${orderItems.pricePerUnit})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(
        and(
          eq(orderItems.farmerId, farmerId),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        )
      )
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(5)
      .all();

    // Get recent orders
    const recentOrders = await db
      .select({
        orderId: orders.id,
        date: orders.createdAt,
        total: sql`SUM(${orderItems.quantity} * ${orderItems.pricePerUnit})`,
        status: orders.status,
        customerName: users.firstName,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orderItems.farmerId, farmerId))
      .groupBy(orders.id, orders.createdAt, orders.status, users.firstName)
      .orderBy(desc(orders.createdAt))
      .limit(10)
      .all();

    // Get inventory status
    const inventory = await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
        price: products.price,
        unit: products.unit,
      })
      .from(products)
      .where(eq(products.farmerId, farmerId))
      .orderBy(products.stock)
      .all();

    // Calculate summary metrics
    const totalProductCount = inventory.length;
    const lowStockCount = inventory.filter((p) => p.stock < 5).length;

    return NextResponse.json({
      farmer: farmerDetails,
      summary: {
        totalRevenue: revenueData?.totalRevenue || 0,
        ordersCount: revenueData?.ordersCount || 0,
        totalProductCount,
        lowStockCount,
        period: parseInt(period),
      },
      dailyRevenue,
      topProducts,
      recentOrders,
      inventory,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
