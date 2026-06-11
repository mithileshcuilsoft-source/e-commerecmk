"use client";

import React from "react";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const SubscriptionSuccessPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-50 p-4 dark:bg-green-900/20">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Welcome to Premium!</h1>
        
        <div className="mb-8 rounded-md bg-blue-50 p-6 text-left dark:bg-blue-900/10">
          <h3 className="mb-2 font-bold text-[#0066c0]">Your benefits are now active:</h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#0066c0]" /> Free shipping activated
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#0066c0]" /> Exclusive discounts unlocked
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-[#0066c0]" /> Priority support enabled
            </li>
          </ul>
        </div>

        <p className="mb-10 text-gray-600 dark:text-gray-400">
          We've sent a confirmation email with your membership details. You can start shopping right away with your new benefits.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/products/all-products" className="flex-1 rounded-sm bg-[#ff9900] py-3 font-bold text-black transition-all hover:bg-[#ff8c00] flex items-center justify-center gap-2">
                <ShoppingBag className="h-5 w-5" /> Start Shopping
            </Link>
            <Link href="/" className="flex-1 rounded-sm border border-gray-300 bg-white py-3 font-bold text-gray-900 transition-all hover:bg-gray-50 flex items-center justify-center gap-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                Go to Home <ArrowRight className="h-5 w-5" />
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionSuccessPage;
