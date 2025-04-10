"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Leaf,
  CircleSlash,
  Globe,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
} from "lucide-react";

// Farmer profile photos
const FARMER_PHOTOS = [
  "https://images.unsplash.com/photo-1594002348772-bc0dea4f8a63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhcm1lcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1569283920802-ca0e5ae11fb1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFybWVyfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1626201850129-a96d056a277b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybWVyfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybWVyfGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1607502519880-a3597714916b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZhcm1lcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1603729312605-e2b83eff8e58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGZhcm1lcnxlbnwwfHwwfHx8MA%3D%3D",
];

// Get a random photo from the farmer photos array
const getRandomPhoto = () => {
  return FARMER_PHOTOS[Math.floor(Math.random() * FARMER_PHOTOS.length)];
};

// Farmer type definition
type Farmer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  farmName: string;
  farmDescription: string | null;
  farmAddress: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  isOrganic: boolean;
  isNonGMO: boolean;
  isSustainable: boolean;
  isPastureRaised: boolean;
  photo?: string; // We'll add this client-side
};

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/farmers");
      if (response.ok) {
        const data = await response.json();
        // Add random photos to each farmer
        const farmersWithPhotos = data.map((farmer: Farmer) => ({
          ...farmer,
          photo: getRandomPhoto(),
        }));
        setFarmers(farmersWithPhotos);
      }
    } catch (error) {
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 bg-accent/30 p-6 rounded-lg border border-secondary">
        <h1 className="text-3xl font-bold text-primary">
          Meet Our Local Farmers
        </h1>
        <p className="text-accent-foreground mt-2">
          Connect with the people who grow your food and support local
          agriculture
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border border-muted rounded-lg overflow-hidden shadow-sm animate-pulse"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 bg-muted"></div>
                <div className="p-4 space-y-2 flex-1">
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="border border-muted rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 h-48 relative">
                  <img
                    src={farmer.photo}
                    alt={`${farmer.firstName} ${farmer.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if loading fails
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/jpeg;base64,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";
                    }}
                  />
                </div>
                <div className="p-4 flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {farmer.farmName}
                  </h2>
                  <p className="text-sm text-accent-foreground mb-2">
                    Run by {farmer.firstName} {farmer.lastName}
                  </p>

                  {farmer.farmDescription && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {farmer.farmDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {farmer.isOrganic && (
                      <span className="bg-primary/80 text-primary-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic
                      </span>
                    )}
                    {farmer.isNonGMO && (
                      <span className="bg-amber-400 text-gray-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <CircleSlash className="h-3 w-3 mr-1" />
                        Non-GMO
                      </span>
                    )}
                    {farmer.isSustainable && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        Sustainable
                      </span>
                    )}
                    {farmer.isPastureRaised && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pasture Raised
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2" />
                      <span>
                        {farmer.farmAddress}, {farmer.city}, {farmer.state}{" "}
                        {farmer.postalCode}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      <span>{farmer.phoneNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-2" />
                      <a
                        href={`mailto:${farmer.email}`}
                        className="text-primary hover:underline"
                      >
                        {farmer.email}
                      </a>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/products?farmerId=${farmer.id}`}
                      className="text-sm text-primary hover:underline flex items-center"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      View products from this farm
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && farmers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No farmers found. Be the first to register!
          </p>
          <div className="mt-4">
            <Link
              href="/register/farmer"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Register as a Farmer
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
