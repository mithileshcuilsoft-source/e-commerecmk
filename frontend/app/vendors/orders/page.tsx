"use client";

import React, { useEffect, useState } from "react";
import { getVendorOrders, updateOrderStatus } from "@/api/order";
import { useRouter } from "next/navigation";

const VendorOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "vendor") {
      router.push("/");
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await getVendorOrders();
        setOrders(response.orders || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load vendor orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextStatuses = (currentStatus: string) => {
    const transitions: { [key: string]: string[] } = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: ["refunded"],
      refunded: [],
    };
    return transitions[currentStatus] || [];
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!token || role !== "vendor") {
      router.push("/");
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await getVendorOrders();
        setOrders(response.orders || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load vendor orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  return (
<div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-15">
  <div className="flex-1 flex flex-col">

    {/* Header */}
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Vendor Orders</h1>
        <p className="text-xs text-gray-500">Manage your orders efficiently</p>
      </div>
    </header>

    {/* Main */}
    <main className="p-4 md:p-6">

      {loading ? (
        <div className="text-center py-20 text-gray-500 animate-pulse">
          Loading orders...
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No orders yet.
        </div>
      ) : (

        <div className="space-y-8">
          {orders.map((order) => (

            <div key={order._id} className="bg-white rounded-2xl shadow-sm border">

              {/* === ORDER SUMMARY (LIGHT + CLEAN) === */}
              <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-gray-700">{order._id}</p>

                  <div className="mt-2 flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium
                      ${order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"}
                    `}>
                      {order.status}
                    </span>

                    <span className="text-sm text-gray-500">
                      {order.items.length} items
                    </span>
                  </div>
                </div>

                {/* Price + Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{order.total?.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getNextStatuses(order.status).map(nextStatus => (
                      <button
                        key={nextStatus}
                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                        disabled={updatingOrderId === order._id}
                        className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                      >
                        {updatingOrderId === order._id
                          ? "Updating..."
                          : nextStatus}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* === DETAILS SECTION (SEPARATED BLOCK) === */}
              <div className="border-t bg-gray-50 p-5 grid gap-6 md:grid-cols-2">

                {/* Buyer */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Buyer Details
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-medium">{order.userId?.name || "Unknown"}</p>
                    <p>{order.userId?.email}</p>
                    {order.userId?.phone && <p>{order.userId.phone}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Shipping Address
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {order.shippingAddress?.type?.charAt(0).toUpperCase() +
                      order.shippingAddress?.type?.slice(1)}{" "}
                    • {order.shippingAddress?.street},{" "}
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state},{" "}
                    {order.shippingAddress?.pinCode},{" "}
                    {order.shippingAddress?.country}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t">

                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Items
                </h3>

                <div className="divide-y">
                  {order.items.map((item: any) => (
                    <div
                      key={`${order._id}-${item.productId?._id || item.productId}`}
                      className="flex justify-between py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.productId?.name || "Product"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  </div>
</div>
  );
};

export default VendorOrdersPage;
