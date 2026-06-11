"use client";

import React from "react";
import { AlertCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const SubscriptionCancelPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-orange-50 p-4 dark:bg-orange-900/20">
            <AlertCircle className="h-16 w-16 text-orange-600" />
          </div>
        </div>
        
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Subscription not completed</h1>
        
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          The payment process was cancelled and you haven't been charged. If you encountered an error, please try again or contact our support team.
        </p>

        <div className="mb-8 border-t border-b border-gray-100 py-4 text-left dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm text-[#0066c0] font-medium">
                <HelpCircle className="h-5 w-5" />
                <span>Need help with your membership? Visit our help center.</span>
            </div>
        </div>

        <div className="flex flex-col gap-4">
            <Link href="/subscription" className="w-full rounded-sm bg-[#ff9900] py-3 font-bold text-black transition-all hover:bg-[#ff8c00]">
                Try Again
            </Link>
            <Link href="/" className="w-full py-3 text-sm font-semibold text-[#0066c0] hover:underline flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Store
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionCancelPage;
