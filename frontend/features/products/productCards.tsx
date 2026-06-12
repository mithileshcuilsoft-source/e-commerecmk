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
      className="group relative flex flex-col bg-white dark:bg-gray-950 rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-900 overflow-hidden"
    >
      {/* Badge container */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {product.available ? (
           <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/50 shadow-sm">
            Featured
          </span>
        ) : (
           <span className="px-3 py-1 bg-red-500 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
            Sold Out
          </span>
        )}
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-gray-900">
        <img
          src={product.images?.[0] || "/images/shoes5.jpg"}
          alt={product.name}
          className={`h-full w-full object-cover transition-all duration-700 ease-out ${
            product.available
              ? "group-hover:scale-110"
              : "opacity-40 grayscale"
          }`}
        />
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out hidden md:block">
          <div className="w-full py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-center text-white font-bold text-sm shadow-xl">
            Quick View
          </div>
        </div>
      </div>

      <div className="mt-6 px-2 pb-2 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-[70%]">
             <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {product.category || "General"}
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-xl">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              ₹{product.price}
            </span>
          </div>
        </div>

        {!product.available && (
          <p className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/10 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            {product.unavailableReason || "Restocking soon"}
          </p>
        )}

        <div className="pt-2 flex items-center gap-3">
            <div className="flex -space-x-1">
                {[1,2,3].map((i) => (
                    <div key={i} className="h-5 w-5 rounded-full border-2 border-white dark:border-gray-950 bg-gray-200" />
                ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">+15 colors available</span>
        </div>
      </div>

      {/* Interactive hover line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 w-0 group-hover:w-full transition-all duration-500" />
    </div>
  );
};

export default ProductCard;