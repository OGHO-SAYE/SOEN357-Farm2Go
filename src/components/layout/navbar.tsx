"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { ShoppingCart, PlusSquare, PackageOpen, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/context/cart-context";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  // We can't use cookies directly in client components, so we'll use localStorage
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { itemCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  // Function to check login status
  const checkLoginStatus = () => {
    const storedFirstName = localStorage.getItem("userFirstName");
    const storedUserType = localStorage.getItem("userType");
    setUserFirstName(storedFirstName);
    setIsLoggedIn(!!storedFirstName);
    setUserType(storedUserType);
  };

  useEffect(() => {
    // Check login status on component mount
    checkLoginStatus();

    // Check login status on route change
    const handleRouteChange = () => {
      checkLoginStatus();
    };

    // Listen for storage events (for cross-tab consistency)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userFirstName" || e.key === null || e.key === "userType") {
        checkLoginStatus();
      }
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [pathname]); // Re-run when pathname changes

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userLastName");
        localStorage.removeItem("userType");

        // Update state
        setUserFirstName(null);
        setIsLoggedIn(false);
        setUserType(null);

        // Redirect to home page
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isFarmer = userType === "farmer";

  return (
    <nav className="border-b border-muted bg-primary">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary-foreground">
              Farm2Go
            </span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Products
            </Link>
            <Link
              href="/farmers"
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              Farmers
            </Link>
            {isFarmer && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/products/manage"
                  className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  Manage Products
                </Link>
              </>
            )}
            {isLoggedIn && !isFarmer && (
              <Link
                href="/orders"
                className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-primary-foreground">
                Welcome, {userFirstName}!
              </span>

              {isFarmer ? (
                // Farmer actions
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    className="text-secondary-foreground hover:bg-secondary/90"
                    asChild
                  >
                    <Link href="/dashboard">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-secondary-foreground hover:bg-secondary/90"
                    asChild
                  >
                    <Link href="/products/manage">
                      <PackageOpen className="h-4 w-4 mr-1" />
                      Manage
                    </Link>
                  </Button>
                  <Button
                    variant="secondary"
                    className="text-secondary-foreground hover:bg-secondary/90"
                    asChild
                  >
                    <Link href="/products/add">
                      <PlusSquare className="h-4 w-4 mr-1" />
                      Add
                    </Link>
                  </Button>
                </div>
              ) : (
                // Show Cart button for consumers
                <Button
                  variant="secondary"
                  className="text-secondary-foreground hover:bg-secondary/90 relative"
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Cart
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                className="text-primary-foreground border-primary-foreground bg-primary/10 hover:bg-accent hover:text-accent-foreground"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-primary-foreground border-primary-foreground bg-primary/10 hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                variant="secondary"
                className="text-secondary-foreground hover:bg-secondary/90"
                asChild
              >
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
