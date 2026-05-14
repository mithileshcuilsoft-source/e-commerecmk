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
    <section className="py-12 bg-gray-50 dark:bg-gray-950 mt-10">
      <div className="max-w-screen-2xl mx-auto px-4">

        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-2">
              Explore our latest products
            </p>
          </div>

          <a
            href="/products/all-products"
            className="text-blue-600 font-semibold hover:underline hidden sm:block"
          >
            View all →
          </a>
        </div>
        {loading && (
          <p className="text-center text-gray-400">
            Loading products...
          </p>
        )}
        {!loading && products.length === 0 && (
          <p className="text-center text-gray-400">
            No products found
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;