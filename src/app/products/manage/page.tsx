"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Leaf,
  CircleSlash,
  Globe,
  CheckCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  stock: number;
  isOrganic: boolean;
  isNonGMO: boolean;
  isSustainable: boolean;
  isPastureRaised: boolean;
  categoryId: string;
  categoryName: string;
  farmerId: string;
  farmerName: string;
};

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get farmer ID from localStorage
  const farmerId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("userType") : null;
  const isUserFarmer = userType === "farmer";

  useEffect(() => {
    // Redirect if not a farmer
    if (typeof window !== "undefined" && userType !== "farmer") {
      router.push("/products");
      return;
    }

    fetchFarmerProducts();
  }, [router, userType]);

  const fetchFarmerProducts = async () => {
    if (!farmerId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products?farmerId=${farmerId}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Failed to fetch your products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("An error occurred while fetching your products");
    } finally {
      setLoading(false);
    }
  };

  if (!isUserFarmer) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center text-sm text-primary hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Manage Your Products
            </h1>
            <p className="text-accent-foreground mt-2">
              View and manage your farm's product inventory
            </p>
          </div>

          <Link
            href="/products/add"
            className="mt-4 sm:mt-0 bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center w-fit"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border border-muted">
          <h3 className="text-lg font-medium">No products yet</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            You haven't added any products to your inventory yet.
          </p>
          <Link
            href="/products/add"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Certifications</th>
                <th className="text-left py-3 px-4 w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-muted hover:bg-muted/20"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div
                        className="w-10 h-10 rounded bg-muted mr-3 flex-shrink-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${
                            product.imageUrl ||
                            "/images/product-placeholder.jpg"
                          })`,
                        }}
                      ></div>
                      <div className="truncate max-w-[180px]">
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.categoryName}</td>
                  <td className="py-3 px-4">
                    ${product.price.toFixed(2)}/{product.unit}
                  </td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isOrganic && (
                        <span className="inline-flex items-center bg-primary/20 text-primary px-2 py-1 rounded-md text-xs">
                          <Leaf className="h-3 w-3 mr-1" />
                        </span>
                      )}
                      {product.isNonGMO && (
                        <span className="inline-flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs">
                          <CircleSlash className="h-3 w-3 mr-1" />
                        </span>
                      )}
                      {product.isSustainable && (
                        <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                        </span>
                      )}
                      {product.isPastureRaised && (
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/products?farmerId=${product.farmerId}`}
                      className="inline-flex items-center text-primary hover:underline text-sm"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
