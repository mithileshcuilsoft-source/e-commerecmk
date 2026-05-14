"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { isUserLoggedIn } from "@/utils/auth";
import { useRouter } from "next/navigation";

// Hook for calling protected APIs with authentication check
export function useCallProtectedApi() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const call = async <T,>(
    apiFunction: () => Promise<T>,
    options?: {
      errorMessage?: string;
      successMessage?: string;
      redirectIfUnauth?: string;
    }
  ): Promise<T | null> => {
    try {
      setIsLoading(true);

      // Check if user is logged in
      if (!isUserLoggedIn()) {
        toast.error(
          options?.errorMessage ||
            "Please login first to access this resource."
        );
        
        if (options?.redirectIfUnauth) {
          router.push(options.redirectIfUnauth);
        } else {
          router.push("/auth/login");
        }
        
        return null;
      }

      // Call the API function
      const result = await apiFunction();

      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      return result;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        options?.errorMessage ||
        "Something went wrong";

      toast.error(message);

      // Handle 401 unauthorized
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/auth/login");
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { call, isLoading };
}
