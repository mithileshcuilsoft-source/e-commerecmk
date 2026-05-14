"use client";

import { useRouter } from "next/navigation";
import { isUserLoggedIn } from "@/utils/auth";
import toast from "react-hot-toast";
import { useState, useCallback } from "react";

// Hook to protect API calls with authentication check
export function useProtectedApi() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuthAndExecute = useCallback(
    async <T,>(
      apiCall: () => Promise<T>,
      message: string = "Please login first to continue."
    ): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if user is logged in
        if (!isUserLoggedIn()) {
          toast.error(message);
          router.push("/auth/login");
          return null;
        }

        // Execute the API call
        const result = await apiCall();
        return result;
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";

        setError(errorMessage);
        
        // Handle 401 - user not authenticated
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session expired. Please login again.");
          router.push("/auth/login");
          return null;
        }

        toast.error(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { checkAuthAndExecute, isLoading, error };
}
