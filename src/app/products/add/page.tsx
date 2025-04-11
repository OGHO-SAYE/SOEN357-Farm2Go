"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  CircleSlash,
  Globe,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    unit: "lb", // Default unit
    stock: "1", // Default stock
    categoryId: "",
    isOrganic: false,
    isNonGMO: false,
    isSustainable: false,
    isPastureRaised: false,
    imageUrl: "/images/product-placeholder.jpg", // Default image
  });

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
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        // First try to fetch from products API to extract categories
        const response = await fetch("/api/products");
        if (response.ok) {
          const products = await response.json();

          // Extract unique categories from products
          const categoryStrings = products.map((product: any) =>
            JSON.stringify({
              id: product.categoryId,
              name: product.categoryName,
            })
          );
          const uniqueStrings = Array.from(new Set(categoryStrings));
          const uniqueCategories = uniqueStrings
            .map((str: unknown) => JSON.parse(str as string) as Category)
            .filter((cat: Category) => cat.id && cat.name); // Filter out any invalid categories

          setCategories(uniqueCategories);

          // Set default category if available
          if (uniqueCategories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              categoryId: uniqueCategories[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [router, userType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerId) {
      setError("You must be logged in as a farmer to add products");
      return;
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId
    ) {
      setError("Please fill out all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          farmerId,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          unit: "lb",
          stock: "1",
          categoryId: categories.length > 0 ? categories[0].id : "",
          isOrganic: false,
          isNonGMO: false,
          isSustainable: false,
          isPastureRaised: false,
          imageUrl: "/images/product-placeholder.jpg",
        });

        // Scroll to top
        window.scrollTo(0, 0);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to add product");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error adding product:", error);
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

        <h1 className="text-3xl font-bold text-primary">Add New Product</h1>
        <p className="text-accent-foreground mt-2">
          Add a new product to your farm's inventory
        </p>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-green-800 font-semibold">
            Product added successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-800 font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-muted rounded-md"
                placeholder="e.g., Organic Tomatoes"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-2 border border-muted rounded-md"
                placeholder="Describe your product..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium mb-1"
                >
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full p-2 border border-muted rounded-md"
                  placeholder="e.g., 4.99"
                />
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium mb-1"
                >
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-muted rounded-md"
                >
                  <option value="lb">lb</option>
                  <option value="each">each</option>
                  <option value="dozen">dozen</option>
                  <option value="oz">oz</option>
                  <option value="bunch">bunch</option>
                  <option value="jar">jar</option>
                  <option value="liter">liter</option>
                  <option value="gallon">gallon</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium mb-1"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-muted rounded-md"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium mb-1"
                >
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-muted rounded-md"
                >
                  {categories.length === 0 ? (
                    <option value="">Loading categories...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Certifications and Image URL */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium mb-1"
              >
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border border-muted rounded-md"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank to use a default image
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Certifications</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isOrganic"
                    name="isOrganic"
                    checked={formData.isOrganic}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor="isOrganic" className="flex items-center">
                    <Leaf className="h-4 w-4 mr-1 text-primary" />
                    <span>Organic</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNonGMO"
                    name="isNonGMO"
                    checked={formData.isNonGMO}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor="isNonGMO" className="flex items-center">
                    <CircleSlash className="h-4 w-4 mr-1 text-amber-600" />
                    <span>Non-GMO</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isSustainable"
                    name="isSustainable"
                    checked={formData.isSustainable}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label htmlFor="isSustainable" className="flex items-center">
                    <Globe className="h-4 w-4 mr-1 text-green-600" />
                    <span>Sustainable</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPastureRaised"
                    name="isPastureRaised"
                    checked={formData.isPastureRaised}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="isPastureRaised"
                    className="flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />
                    <span>Pasture Raised</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Product...
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
