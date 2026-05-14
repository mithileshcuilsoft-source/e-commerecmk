"use client";

import { useEffect, useState } from "react";
import { getOrderTracking } from "@/api/order";
import { CheckCircle, Clock, Truck, Package, XCircle, RotateCcw } from "lucide-react";

interface TrackingStep {
  status: string;
  label: string;
  description: string;
  completed: boolean;
  timestamp?: string;
  note?: string;
  updatedBy?: {
    name: string;
    role: string;
  };
}

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking = ({ orderId }: OrderTrackingProps) => {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTracking = async () => {
      setLoading(true);
      try {
        const data = await getOrderTracking(orderId);
        setTrackingData(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load tracking information.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadTracking();
    }
  }, [orderId]);

  const getStatusIcon = (status: string, completed: boolean) => {
    const iconClass = completed ? "text-green-600" : "text-gray-400";

    switch (status) {
      case "placed":
        return <Package className={`w-6 h-6 ${iconClass}`} />;
      case "confirmed":
        return <CheckCircle className={`w-6 h-6 ${iconClass}`} />;
      case "processing":
        return <Clock className={`w-6 h-6 ${iconClass}`} />;
      case "shipped":
        return <Truck className={`w-6 h-6 ${iconClass}`} />;
      case "delivered":
        return <CheckCircle className={`w-6 h-6 ${iconClass}`} />;
      case "cancelled":
        return <XCircle className={`w-6 h-6 ${iconClass}`} />;
      case "refunded":
        return <RotateCcw className={`w-6 h-6 ${iconClass}`} />;
      default:
        return <Clock className={`w-6 h-6 ${iconClass}`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No tracking information available.</p>
      </div>
    );
  }

  return (
<div className="max-w-3xl mx-auto p-4 sm:p-6">
  <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-gray-100 p-6">

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
          Order Tracking
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Track your shipment progress in real-time
        </p>
      </div>

      <div className="bg-gray-50 px-4 py-2 rounded-lg border">
        <p className="text-xs text-gray-500">Order ID</p>
        <p className="font-mono text-sm text-gray-800">
          {trackingData.orderId}
        </p>
      </div>
    </div>

    {/* Tracking Number */}
    {trackingData.trackingNumber && (
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
        <p className="text-xs text-gray-500">Tracking Number</p>
        <p className="font-semibold text-blue-700 text-lg tracking-wide">
          {trackingData.trackingNumber}
        </p>
      </div>
    )}

    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-gray-200"></div>

      <div className="space-y-8">
        {trackingData.trackingTimeline.map((step: TrackingStep, index: number) => (
          <div key={step.status} className="relative flex items-start space-x-4">

            <div className="z-10">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                ${step.completed 
                  ? 'bg-green-100 border-green-500 shadow-sm' 
                  : 'bg-gray-100 border-gray-300'}
              `}>
                {getStatusIcon(step.status, step.completed)}
              </div>
            </div>

            
            <div className="flex-grow bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className={`text-base font-semibold
                  ${step.completed ? 'text-green-600' : 'text-gray-400'}
                `}>
                  {step.label}
                </h3>

                {step.timestamp && (
                  <span className="text-xs text-gray-500">
                    {new Date(step.timestamp).toLocaleDateString()} •{" "}
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>

              <p className={`text-sm mt-2 leading-relaxed
                ${step.completed ? 'text-gray-700' : 'text-gray-400'}
              `}>
                {step.description}
              </p>

              {step.note && step.note !== step.description && (
                <p className="text-sm text-gray-600 mt-2 italic bg-white px-3 py-2 rounded-md border">
                  "{step.note}"
                </p>
              )}

              {step.updatedBy && (
                <p className="text-xs text-gray-500 mt-2">
                  Updated by:{" "}
                  <span className="font-medium text-gray-700">
                    {step.updatedBy.name}
                  </span>{" "}
                  ({step.updatedBy.role})
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="mt-10 pt-6 border-t border-gray-100">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Order placed on</span>
        <span className="font-medium text-gray-800">
          {new Date(trackingData.orderDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
        <span>Current status</span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 capitalize">
          {trackingData.currentStatus}
        </span>
      </div>
    </div>

  </div>
</div>
  );
};

export default OrderTracking;