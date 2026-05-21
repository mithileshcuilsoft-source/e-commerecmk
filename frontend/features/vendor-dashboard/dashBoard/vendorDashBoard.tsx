"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct, getVendorProducts } from "@/api/productapi";

export default function VendorDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const data = await getVendorProducts();

      let productsData: any[] = [];

      if (Array.isArray(data)) {
        productsData = data;
      } else if (Array.isArray(data.products)) {
        productsData = data.products;
      } else if (Array.isArray(data.data)) {
        productsData = data.data;
      }

      setProducts([...productsData]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      if (!token || role !== "vendor") {
        router.push("/");
        return;
      }

      await fetchProducts();
    };

    init();
  }, []);

  //  DELETE PRODUCT 
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  //  STOCK STATUS
  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 15) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
  <div className="flex-1 flex flex-col">

    {/* MAIN */}
    <main className="p-4 sm:p-6 md:p-8 space-y-6 mt-16 sm:mt-20">

      {/* HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-center bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
        
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Inventory
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Syncing products..." : `Manage your ${products.length} products`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">

          {/* SEARCH */}
          <div className="flex items-center bg-gray-50 border-gray-200 border px-3 py-2.5 rounded-xl w-full sm:w-80 group focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <Search className="w-4 h-4 mr-2 shrink-0 text-gray-400 group-focus-within:text-blue-500" />
            <input
              placeholder="Search products..."
              className="outline-none w-full bg-transparent text-sm font-medium"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* FILTER */}
            <button className="p-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors flex-1 sm:flex-none flex justify-center items-center">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>

            {/* ADD PRODUCT */}
            <Link
              href="/vendors/add-products"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all text-center whitespace-nowrap flex-1 sm:flex-none"
            >
              + Add New
            </Link>
          </div>

        </div>
      </div>

      {/* TABLE SECTION */}
      <Card className="rounded-2xl border-gray-100 shadow-xl overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full min-w-[800px] border-collapse">
            <thead className="bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="p-5 text-left">Product Details</th>
                <th className="px-5 py-4 text-left">Category</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Stock Level</th>
                <th className="px-5 py-4 text-left">Availability</th>
                <th className="px-5 py-4 text-right pr-8">Management</th>
              </tr>
            </thead>

            <tbody>
              {!loading && products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center p-6 text-gray-400"
                  >
                    No products found
                  </td>
                </tr>
              )}

              {products.map((product) => {
                const status = getStatus(product.stock);
                const isDeleting = deletingId === product._id;

                return (
                  <tr
                    key={product._id}
                    className="border-t text-sm"
                  >

                    {/* PRODUCT */}
                    <td className="p-4">
                      <div className="flex items-center gap-3 min-w-[200px]">

                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>

                        <div>
                          <p className="font-semibold break-words">
                            {product.name}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.category}
                    </td>

                    {/* PRICE */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      ₹{product.price}
                    </td>

                    {/* STOCK */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {product.stock}

                        {product.stock <= 15 &&
                          product.stock > 0 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-bold">
                        {status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="text-right pr-6 whitespace-nowrap">
                      <div className="flex justify-end gap-3">

                        <button
                          onClick={() =>
                            router.push(`/vendors/edit/${product._id}`)
                          }
                          className="text-blue-500"
                          disabled={isDeleting}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="text-red-500"
                          disabled={isDeleting}
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </Card>

    </main>
  </div>
</div>
  );
}