"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  CheckCircle,
  Leaf,
  CircleSlash,
  Globe,
} from "lucide-react";
import { useCart } from "@/lib/context/cart-context";

// Product image placeholders as embedded realistic images
const PRODUCT_IMAGES = {
  // Default product image
  default:
    "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400",

  // Category-specific realistic images
  vegetables:
    "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=400",

  fruits:
    "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400",

  dairy:
    "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400",

  meat: "data:image/jpeg;base64,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",

  eggs: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RWdnc3xlbnwwfHwwfHx8MA%3D%3D",

  honey:
    "https://zanducare.com/cdn/shop/articles/Untitled_design_9.jpg?v=1713867299",

  herbs:
    "https://images.unsplash.com/photo-1679061583335-c8be1c6209f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJlc2glMjBoZXJic3xlbnwwfHwwfHx8MA%3D%3D",
} as const;

type ImageKeys = keyof typeof PRODUCT_IMAGES;

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

type Category = {
  id: string;
  name: string;
};

// Additional specific product images
const SPECIFIC_PRODUCT_IMAGES = {
  tomatoes:
    "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=400",
  spinach:
    "https://i0.wp.com/post.healthline.com/wp-content/uploads/2019/05/spinach-1296x728-header.jpg?w=1155&h=1528",
  cheese:
    "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400",
  beef: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2d51nKN2mcsA9IBioNP0YtJ_9_WhslKBdgg&s",
  apples:
    "https://images.pexels.com/photos/2487443/pexels-photo-2487443.jpeg?auto=compress&cs=tinysrgb&w=400",
  herbs:
    "https://images.unsplash.com/photo-1679061583335-c8be1c6209f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZnJlc2glMjBoZXJic3xlbnwwfHwwfHx8MA%3D%3D",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const { addToCart } = useCart();

  // Get user from localStorage
  const userFirstName =
    typeof window !== "undefined"
      ? localStorage.getItem("userFirstName") || "Guest"
      : "Guest";

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = selectedCategory
        ? `/api/products?categoryId=${selectedCategory}`
        : "/api/products";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);

        // Extract unique categories from products
        if (!selectedCategory) {
          const categoryStrings = data.map((product: Product) =>
            JSON.stringify({
              id: product.categoryId,
              name: product.categoryName,
            })
          );
          const uniqueStrings = Array.from(new Set(categoryStrings));
          const uniqueCategories = uniqueStrings.map(
            (str: unknown) => JSON.parse(str as string) as Category
          );

          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1, product.name);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 bg-accent/30 p-6 rounded-lg border border-secondary">
        <h1 className="text-3xl font-bold text-primary">
          Welcome to Farm2Go, {userFirstName}!
        </h1>
        <p className="text-accent-foreground mt-2">
          Browse our selection of fresh, locally-grown produce
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="border border-muted rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-48 bg-muted"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-muted rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
            >
              <div className="aspect-square relative">
                <div className="relative w-full h-full">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      // If external image fails to load, show a generic fallback
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400";
                      // Prevent infinite error loop if both fail
                      target.onerror = null;
                    }}
                  />
                </div>
                {/* Product badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.isOrganic && (
                    <span className="bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <Leaf className="h-3 w-3 mr-1" />
                      Organic
                    </span>
                  )}
                  {product.isNonGMO && (
                    <span className="bg-amber-400 text-gray-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <CircleSlash className="h-3 w-3 mr-1" />
                      Non-GMO
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  From {product.farmerName}
                </p>
                {/* Product certifications */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.isSustainable && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Globe className="h-3 w-3 mr-1 text-accent-foreground" />
                      Sustainable
                    </span>
                  )}
                  {product.isPastureRaised && (
                    <span className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-accent-foreground" />
                      Pasture Raised
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-brown">
                    ${product.price.toFixed(2)}/{product.unit}
                  </span>
                  <button
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found. Please try another category.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to get the right image for a product
const getProductImage = (product: Product): string => {
  // First check if we have a specific image for this product
  const productNameLower = product.name.toLowerCase();

  // Check for specific product matches
  if (productNameLower.includes("tomato"))
    return SPECIFIC_PRODUCT_IMAGES.tomatoes;
  if (productNameLower.includes("spinach"))
    return SPECIFIC_PRODUCT_IMAGES.spinach;
  if (productNameLower.includes("cheese"))
    return SPECIFIC_PRODUCT_IMAGES.cheese;
  if (productNameLower.includes("beef")) return SPECIFIC_PRODUCT_IMAGES.beef;
  if (productNameLower.includes("apple")) return SPECIFIC_PRODUCT_IMAGES.apples;
  if (productNameLower.includes("herb")) return SPECIFIC_PRODUCT_IMAGES.herbs;

  // Map category names to image keys
  const categoryToImageMap: Record<string, ImageKeys> = {
    Vegetables: "vegetables",
    Fruits: "fruits",
    Dairy: "dairy",
    Meat: "meat",
    Eggs: "eggs",
    "Honey & Preserves": "honey",
  };

  // Get image based on category
  const imageKey = categoryToImageMap[product.categoryName];
  return imageKey ? PRODUCT_IMAGES[imageKey] : PRODUCT_IMAGES.default;
};
