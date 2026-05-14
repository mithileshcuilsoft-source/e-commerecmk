"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ProductCard = ({ product }: any) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group border border-gray-100 dark:border-gray-800 rounded-2xl p-3 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 mt-15"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800">
        <img
          src={product.images?.[0] || "/images/shoes5.jpg"}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            product.available
              ? "group-hover:scale-105"
              : "opacity-50 grayscale"
          }`}
        />

        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
              Product Not Available
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 px-1">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {product.category}
        </p>

        {!product.available && (
          <p className="text-red-500 text-xs mt-2 font-semibold">
            {product.unavailableReason || "Product not available"}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
            ₹{product.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;