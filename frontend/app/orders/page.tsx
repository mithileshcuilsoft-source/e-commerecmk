"use client";

import { useEffect, useState } from "react";
import { getMyOrders, updateOrderStatus } from "@/api/order";
import OrderTracking from "@/components/OrderTracking";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);

      try {
        const response = await getMyOrders();
        setOrders(response.orders || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    setError("");

    try {
      await updateOrderStatus(orderId, "cancelled", "Cancelled by buyer");
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to cancel the order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 mt-15">

    {selectedOrderId ? (
      <div>
        <button
          onClick={() => setSelectedOrderId(null)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Orders
        </button>
  
        <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
          <OrderTracking orderId={selectedOrderId} />
        </div>
  
      </div>
    ) : (
      <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage your purchases
          </p>
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-medium">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No orders found yet.
          </div>
        ) : (
  
          <div className="space-y-8">
  
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition"
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
  
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="font-mono text-sm text-gray-700">
                      {order._id}
                    </p>
  
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold capitalize
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
  
                      {order.status !== "cancelled" && (
                        <button
                          onClick={() => setSelectedOrderId(order._id)}
                          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Track
                        </button>
                      )}
  
                      {['placed', 'confirmed', 'processing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrderId === order._id}
                          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {cancellingOrderId === order._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      )}
  
                    </div>
                  </div>
                </div>
  
                <div className="border-t bg-gray-50 p-5 grid gap-5 sm:grid-cols-2">
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
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      Placed On
                    </h3>
                    <p className="text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
  
                </div>

                <div className="p-5 border-t">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Items
                  </h3>
  
                  <div className="divide-y">
                    {order.items?.map((item: any) => (
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
      </>
    )}
  </div>
  );
};

export default OrdersPage;