"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/auth";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  message?: string;
}

export function ProtectedRoute({ 
  children, 
  message = "Please login first to continue." 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Small delay to ensure localStorage is available
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!isUserLoggedIn()) {
        toast.error(message);
        router.push("/auth/login");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, message]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
