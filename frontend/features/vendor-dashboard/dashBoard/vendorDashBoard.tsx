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

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      // 🔥 instant UI update (no refetch)
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- STOCK STATUS ----------------
  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 15) return "Low Stock";
    return "In Stock";
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="flex-1 flex flex-col">

        {/* MAIN */}
        <main className="p-6 space-y-6 mt-20">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Product List</h2>

            <div className="flex gap-2 items-center">
              <div className="flex items-center bg-white border px-3 py-2 rounded">
                <Search className="w-4 h-4 mr-2" />
                <input placeholder="Search..." className="outline-none" />
              </div>

              <button className="p-2 border rounded">
                <Filter className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/vendors/add-products"
              className="bg-black text-white px-4 py-2 rounded-xl text-sm"
            >
              Add Product
            </Link>
          </div>

          {/* STATUS */}
          <p className="text-sm text-gray-500">
            {loading
              ? "Loading products..."
              : `${products.length} products loaded`}
          </p>

          {/* TABLE */}
          <Card className="rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="p-4 text-left">Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="text-right pr-6">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {!loading && products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center p-6 text-gray-400">
                        No products found
                      </td>
                    </tr>
                  )}

                  {products.map((product) => {
                    const status = getStatus(product.stock);
                    const isDeleting = deletingId === product._id;

                    return (
                      <tr key={product._id} className="border-t">

                        {/* PRODUCT */}
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>

                          <div>
                            <p className="font-semibold">{product.name}</p>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td>{product.category}</td>

                        {/* PRICE */}
                        <td>₹{product.price}</td>

                        {/* STOCK */}
                        <td>
                          <div className="flex items-center gap-2">
                            {product.stock}
                            {product.stock <= 15 && product.stock > 0 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td>
                          <span className="text-xs font-bold">
                            {status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="text-right pr-6 space-x-2">

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
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>

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