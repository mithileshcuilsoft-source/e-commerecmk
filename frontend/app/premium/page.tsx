"use client";

import React, { useEffect, useState } from "react";
import { Lock, Sparkles, ShoppingBag, Gift, ArrowRight, Loader2, Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/api/client";
import Link from "next/link";

const PremiumLoungePage = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPremiumContent();
  }, []);

  const fetchPremiumContent = async () => {
    try {
      const response = await apiClient.get("/subscription/premium-content");
      if (response.data.success) {
        setContent(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "You need a premium subscription to access this page.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-12 w-12 animate-spin text-[#0066c0]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-orange-50 p-4 dark:bg-orange-900/20">
              <Lock className="h-12 w-12 text-[#ff9900]" />
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Premium Membership Required</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">{error}</p>
          <Link href="/subscription" className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#ff9900] py-3 font-bold text-black transition-all hover:bg-[#ff8c00]">
            Join Premium Now <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Premium Header */}
      <div className="bg-[#131921] py-12 text-white">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                     <div className="mb-2 flex items-center gap-2 text-[#ff9900]">
                        <BadgeCheck className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Premium Member</span>
                    </div>
                    <h1 className="text-3xl font-extrabold md:text-4xl">{content?.message}</h1>
                    <p className="mt-2 text-gray-400">Your exclusive access to members-only benefits and deals.</p>
                </div>
                <div className="hidden h-20 w-px bg-gray-700 md:block" />
                <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400">Current Status</p>
                    <p className="text-lg font-bold text-green-400">Active Membership</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 flex items-center gap-3">
            <Star className="h-6 w-6 text-[#ff9900] fill-[#ff9900]" />
            <h2 className="text-2xl font-bold dark:text-white">Active Exclusive Deals</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content?.exclusiveDeals.map((deal: any) => (
            <motion.div 
              key={deal.id}
              className="group flex flex-col border border-gray-200 bg-white p-6 transition-all hover:border-[#0066c0] dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-sm bg-gray-50 text-[#0066c0] transition-colors group-hover:bg-[#0066c0] group-hover:text-white dark:bg-gray-800">
                <ShoppingBag className="h-7 w-7" />
              </div>
              
              <h3 className="mb-2 text-xl font-bold dark:text-white">{deal.name}</h3>
              
              <div className="mb-6">
                <span className="rounded-sm bg-green-50 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {deal.discount}
                </span>
              </div>

              <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-sm bg-[#ff9900] py-3 text-sm font-bold text-black transition-all hover:bg-[#ff8c00]">
                Claim Deal <Gift className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Teasre */}
        <div className="mt-16 border-t border-gray-100 pt-16 dark:border-gray-800">
            <div className="rounded-sm bg-[#f0f2f2] p-8 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex items-center gap-6">
                        <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-white text-[#0066c0] shadow-sm dark:bg-gray-800 md:flex">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold dark:text-white">Suggest new premium features</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">We want to hear from our most valued members. What should we add next?</p>
                        </div>
                    </div>
                    <button className="whitespace-nowrap rounded-sm border border-[#d5d9d9] bg-white px-8 py-2.5 text-sm font-bold text-black shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                        Give Feedback
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLoungePage;
