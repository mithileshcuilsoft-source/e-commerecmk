"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/features/products/productCards";
import { getAllProducts } from "@/api/productapi";


const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();

      console.log("API RESPONSE:", data);

      let finalProducts: any[] = [];

  
      if (Array.isArray(data)) {
        finalProducts = data;
      } else if (Array.isArray(data.products)) {
        finalProducts = data.products;
      } else if (Array.isArray(data.data)) {
        finalProducts = data.data;
      }

      setProducts(finalProducts);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-zinc-50 dark:bg-black">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured <span className="text-blue-600">Products</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              Explore our handpicked selection of top-rated items.
            </p>
          </div>

          <a
            href="/products/all-products"
            className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
          >
            Explore all products
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,4,4].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 animate-pulse rounded-3xl" />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 dark:text-gray-400 text-xl font-semibold">
              No products available at the moment.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;