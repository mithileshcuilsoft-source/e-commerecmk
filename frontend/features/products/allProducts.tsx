"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/features/products/productCards";
import { getAllProducts } from "@/api/productapi";
import { Search, SlidersHorizontal, PackageSearch, Loader2 } from "lucide-react"; // Optional: npm i lucide-react

const AllProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const finalProducts = Array.isArray(data) ? data : (data.products || data.data || []);
        setProducts(finalProducts);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) =>
      (p.title || p.name)?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 mt-15">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Best Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Showing new premium products
          </p>
        </header>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 sticky top-4 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or category..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <select 
                className="w-full md:w-56 pl-10 pr-8 py-3 bg-gray-100 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer dark:text-white"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Newest Arrivals</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 animate-pulse">Curating the best products for you...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="transform hover:-translate-y-1 transition-transform duration-300">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-100 dark:bg-zinc-900 p-6 rounded-full mb-6">
                  <PackageSearch className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 max-w-xs">
                  We couldn't find anything matching "{searchTerm}". Try a different keyword.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
