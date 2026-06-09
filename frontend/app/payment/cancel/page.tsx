"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-20 h-20 mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-10 h-10 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your payment was not completed. You can try again from your orders page or checkout again.
      </p>
      <div className="flex gap-4">
        <Link
          href="/checkout"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Back to Checkout
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
