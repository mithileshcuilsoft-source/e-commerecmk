"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Package,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SideBarDashboard from "../sidebar/sideBarBoard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProduct, getVendorProducts } from "@/api/productapi";

export default function VendorDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const data = await getVendorProducts();

      console.log("FULL API RESPONSE:", data);

      let productsData: any[] = [];

      if (Array.isArray(data)) {
        productsData = data;
      } else if (Array.isArray(data.products)) {
        productsData = data.products;
      } else if (Array.isArray(data.data)) {
        productsData = data.data;
      }

      console.log("FINAL PRODUCTS:", productsData);

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
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= 15) return "Low Stock";
    return "In Stock";
  };



  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      {/* <aside className="hidden md:flex w-64 flex-col bg-white border-r relative ">
        <SideBarDashboard />
      </aside> */}

      <div className="flex-1 flex flex-col">

        {/* Main */}
        <main className="p-6 space-y-6 mt-20">
          {/* Top */}
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Product List</h2>

            <div className="flex gap-2">
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
            className="bg-black text-white px-4 py-2 rounded-xl text-sm "
          >
            Add Product
          </Link>
          </div>

          <p className="text-sm text-gray-500">
            {loading
              ? "Loading products..."
              : `${products.length} products loaded`}
          </p>

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

                    return (
                      <tr key={product._id} className="border-t">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>

                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-gray-400">
                              {/* {product._id} */}
                            </p>
                          </div>
                        </td>

                        <td>{product.category}</td>
                        <td>₹{product.price}</td>

                        <td>
                          <div className="flex items-center gap-2">
                            {product.stock}
                            {product.stock <= 15 && product.stock > 0 && (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="text-xs font-bold">{status}</span>
                        </td>

                        <td className="text-right pr-6 space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/vendors/edit/${product._id}`)
                            }
                            className="text-blue-500"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500"
                          >
                            Delete
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