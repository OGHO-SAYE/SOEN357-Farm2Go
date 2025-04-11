import React, { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "@/components/ui/toast";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    imageUrl: string;
    farmerName?: string;
  };
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  addToCart: (
    productId: string,
    quantity: number,
    name: string
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

type CartProviderProps = {
  children: React.ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: "success" | "error";
  }>({
    open: false,
    title: "",
    description: "",
    variant: "success",
  });

  // Get user ID from cookies
  const getUserId = () => {
    // In a client component, we'd use cookies or localStorage
    // For now, we'll assume the user ID is stored in localStorage
    return typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;
  };

  // Fetch cart items when component mounts
  useEffect(() => {
    loadCartItems();

    // Add event listener for storage changes (login/logout)
    const handleStorageChange = (e: StorageEvent | Event) => {
      // If localStorage changed (login/logout) or manually triggered
      if (e instanceof StorageEvent) {
        if (e.key === "userId" || e.key === "userFirstName" || e.key === null) {
          loadCartItems();
        }
      } else {
        // For manually dispatched events
        loadCartItems();
      }
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch cart items from API
  const loadCartItems = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        updateItemCount();
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update item count from API
  const updateItemCount = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const response = await fetch(`/api/cart/count?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setItemCount(data.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  // Add item to cart
  const addToCart = async (
    productId: string,
    quantity: number,
    name: string
  ) => {
    const userId = getUserId();
    if (!userId) {
      showToast("Error", "Please log in to add items to your cart", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });

      if (response.ok) {
        await loadCartItems();
        showToast(
          "Added to cart",
          `${name} has been added to your cart`,
          "success"
        );
      } else {
        const error = await response.json();
        showToast(
          "Error",
          error.error || "Failed to add item to cart",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast("Error", "Failed to add item to cart", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    const userId = getUserId();
    if (!userId || quantity < 1) return;

    setIsLoading(true);
    try {
      // Find the cart item and its product ID
      const cartItem = items.find((item) => item.id === itemId);
      if (!cartItem) return;

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId: cartItem.product.id,
          quantity,
        }),
      });

      if (response.ok) {
        await loadCartItems();
      } else {
        const error = await response.json();
        showToast("Error", error.error || "Failed to update quantity", "error");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showToast("Error", "Failed to update quantity", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart?id=${itemId}&userId=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadCartItems();
        showToast(
          "Item removed",
          "Item has been removed from your cart",
          "success"
        );
      } else {
        const error = await response.json();
        showToast("Error", error.error || "Failed to remove item", "error");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      showToast("Error", "Failed to remove item", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart (used after checkout)
  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/cart/clear?userId=${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems([]);
        setItemCount(0);
      } else {
        const error = await response.json();
        console.error("Error clearing cart:", error);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show toast notification
  const showToast = (
    title: string,
    description: string,
    variant: "success" | "error"
  ) => {
    setToast({
      open: true,
      title,
      description,
      variant,
    });

    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 3000);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
      {toast.open && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg p-4 flex items-start gap-4 transition-all transform translate-x-0
            ${
              toast.variant === "success"
                ? "bg-green-50 border border-green-500"
                : "bg-red-50 border border-red-500"
            }`}
        >
          <div className="flex-1">
            <div
              className={`font-medium ${
                toast.variant === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {toast.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {toast.description}
            </div>
          </div>
          <button
            className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full"
            onClick={() => setToast((prev) => ({ ...prev, open: false }))}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
}
