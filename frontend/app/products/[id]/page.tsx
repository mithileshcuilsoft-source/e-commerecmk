"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { getProductById } from "@/api/productapi";

import { useCartStore } from "@/store/useCartStore";

import { getCookie } from "@/lib/cookies";

const ProductDetailsPage = () => {

  const { id } = useParams();

  const router = useRouter();

  // ZUSTAND
  const addToCart =useCartStore((state:any) =>state.addToCart);

  const [product, setProduct] =useState<any>(null);

  const [loading, setLoading] =useState(true);

  const [error, setError] =useState<string | null>(null);

  const [message, setMessage] =useState("");

  const isAuthenticated = () => {

    if ( typeof window ==="undefined"
    ) {
      return false;
    }

    return Boolean(
      getCookie("token") ||localStorage.getItem(
          "token"
        )
    );
  };

  useEffect(() => {

    const fetchProduct = async () => {
       try {
          const data =
            await getProductById(
              id as string
            );

          setProduct(data);

        } catch (error) {

          console.error(error);

          setError(
            "Failed to load product"
          );

        } finally {

          setLoading(false);
        }
      };

    if (id) {
      fetchProduct();
    }

  }, [id]);

  if (loading) {

    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (error) {

    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {

    return (
      <div className="p-10 text-center">
        Product not found
      </div>
    );
  }

  const isUnavailable =
    !product.available;

  const handleAddToCart =
    async () => {

      try {
        if (
          !isAuthenticated()
        ) {

          router.push(
            "/auth/login"
          );

          return;
        }

        if (
          isUnavailable
        ) {

          setMessage(
            product.unavailableReason ||
              "Product is not available"
          );

          return;
        }

        // ADD TO CART
        await addToCart(
          product._id,
          1
        );

        // SPA NAVIGATION
        router.push("/cart");

      } catch (error) {

        console.error(error);

        setMessage(
          "Failed to add to cart"
        );
      }
    };


  const handleBuyNow =
    async () => {

      try {

        // LOGIN CHECK
        if (
          !isAuthenticated()
        ) {

          router.push(
            "/auth/login"
          );

          return;
        }

        // PRODUCT UNAVAILABLE
        if (
          isUnavailable
        ) {

          setMessage(
            product.unavailableReason ||
              "Product is not available"
          );

          return;
        }

        // ADD TO CART
        await addToCart(
          product._id,
          1
        );

        // SPA NAVIGATION
        router.push(
          "/checkout"
        );

      } catch (error) {

        console.error(error);

        setMessage(
          "Failed to process order"
        );
      }
    };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 mt-16 sm:mt-20">
        
        {/* PRODUCT IMAGE SECTION */}
        <div className="relative">
          <div className="aspect-square sm:aspect-video md:aspect-square overflow-hidden rounded-2xl shadow-xl bg-gray-50">
            <img
              src={product.images?.[0] || "/images/shoes5.jpg"}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-500 hover:scale-105 ${
                isUnavailable ? "grayscale opacity-50" : ""
              }`}
            />
            
            {isUnavailable && (
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                <div className="rounded-xl bg-red-600/90 backdrop-blur-sm px-6 py-3 text-lg font-bold text-white shadow-lg">
                  NOT AVAILABLE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT DETAILS SECTION */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <span className="text-blue-600 uppercase text-xs font-bold tracking-widest leading-none">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-3xl sm:text-4xl font-black text-gray-900">
              ₹{product.price.toLocaleString()}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              isUnavailable ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
            }`}>
              {isUnavailable ? "Out of Stock" : "In Stock"}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">
            {product.description || "Premium quality product with exceptional durability and design."}
          </p>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 text-sm font-medium">
              {message}
            </div>
          )}

          {/* ACTIONS SECTION */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={isUnavailable}
              className={`flex-1 py-4 rounded-xl text-base font-bold transition-all shadow-md active:scale-95 ${
                isUnavailable
                  ? "cursor-not-allowed bg-gray-200 text-gray-400"
                  : "bg-gray-900 text-white hover:bg-black"
              }`}
            >
              {isUnavailable ? "Unavailable" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isUnavailable}
              className={`flex-1 py-4 rounded-xl text-base font-bold transition-all border-2 active:scale-95 ${
                isUnavailable
                  ? "cursor-not-allowed border-gray-100 text-gray-300"
                  : "border-gray-900 text-gray-900 hover:bg-gray-50"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;