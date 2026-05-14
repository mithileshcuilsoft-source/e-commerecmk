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
  const addToCart =useCartStore((state) =>state.addToCart);

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
    <div className="mx-auto grid max-w-6xl gap-10 p-6 md:grid-cols-2">

      {/* PRODUCT IMAGE */}
      <div className="relative">

        <img
          src={
            product.images?.[0] ||
            "/images/shoes5.jpg"
          }
          alt={product.name}
          className={`h-[400px] w-full rounded-xl object-cover ${
            isUnavailable
              ? "grayscale opacity-50"
              : ""
          }`}
        />

        {/* UNAVAILABLE OVERLAY */}
        {isUnavailable && (

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="rounded-xl bg-red-600 px-6 py-3 text-lg font-bold text-white">
              Product Not Available
            </div>

          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="space-y-4">

        <h1 className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-500">
          {product.category}
        </p>

        <p>
          {product.description}
        </p>

        <div className="text-2xl font-bold text-blue-600">
          ₹{product.price}
        </div>

        {/* STOCK */}
        <div
          className={`font-semibold ${
            isUnavailable
              ? "text-red-500"
              : "text-green-600"
          }`}
        >
          {isUnavailable
            ? product.unavailableReason ||
              "Product unavailable"
            : `In Stock (${product.stock})`}
        </div>

        {/* MESSAGE */}
        {message && (

          <div className="rounded-xl border border-red-300 bg-red-100 px-4 py-3 text-red-600">

            {message}

          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3">

          {/* ADD TO CART */}
          <button
            onClick={
              handleAddToCart
            }
            disabled={
              isUnavailable
            }
            className={`rounded-xl px-6 py-3 text-white ${
              isUnavailable
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isUnavailable
              ? "Product Not Available"
              : "Add to Cart"}
          </button>

          {/* BUY NOW */}
          <button
            onClick={
              handleBuyNow
            }
            disabled={
              isUnavailable
            }
            className={`rounded-xl border px-6 py-3 ${
              isUnavailable
                ? "cursor-not-allowed border-gray-300 text-gray-400"
                : "border-black hover:bg-gray-100"
            }`}
          >
            {isUnavailable
              ? "Unavailable"
              : "Buy Now"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;