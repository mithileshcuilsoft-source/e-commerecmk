"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2, Sparkles, Zap, ShieldCheck, Clock, Gift, Star } from "lucide-react";
import { motion } from "framer-motion";
import apiClient from "@/api/client";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: string[];
  stripePriceId: string;
}

const AmazonStyleSubscriptionPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await apiClient.get("/subscription/plans");
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login to subscribe");
      router.push("/auth/login");
      return;
    }

    setProcessingId(planId);
    try {
      const response = await apiClient.post("/subscription/checkout", { planId });
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate checkout");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <Loader2 className="h-12 w-12 animate-spin text-[#0066c0]" />
      </div>
    );
  }

  // Find the "Professional" or "Pro" plan to feature it like Amazon Prime
  const featuredPlan = plans.find(p => p.name.toLowerCase().includes("pro")) || plans[0];
  const otherPlans = plans.filter(p => p._id !== featuredPlan?._id);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section - Amazon Prime Style */}
      <section className="relative overflow-hidden bg-[#131921] py-16 text-white md:py-24">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-0 h-64 w-64 rounded-full bg-blue-500 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-indigo-600 blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-md bg-[#37475a] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#ff9900]"
            >
              <Star className="h-3 w-3 fill-current" /> Premium Membership
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl"
            >
              Enjoy the best of <span className="text-[#00a8e1]">E-COMMERCE</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 text-lg text-gray-300 md:text-xl"
            >
              Fast delivery, exclusive deals, and premium content. All in one membership.
            </motion.p>

            {featuredPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <button 
                  onClick={() => handleSubscribe(featuredPlan._id)}
                  disabled={processingId === featuredPlan._id}
                  className="w-full max-w-md rounded-md bg-[#ff9900] py-4 text-lg font-bold text-black transition-all hover:bg-[#ff8c00] active:scale-95 disabled:opacity-70"
                >
                  {processingId === featuredPlan._id ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  ) : (
                    `Join ${featuredPlan.name} - $${featuredPlan.price}/${featuredPlan.billingCycle === "monthly" ? "month" : "year"}`
                  )}
                </button>
                <p className="text-sm text-gray-400">Cancel anytime. No hidden fees.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid - Flat & Clean */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
             <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0066c0] dark:bg-gray-900">
                    <Clock className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">Fast & Free Shipping</h3>
                <p className="text-gray-600 dark:text-gray-400">Unlimited fast, free shipping on millions of eligible items.</p>
             </div>
             <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#ff9900] dark:bg-gray-900">
                    <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">Exclusive Deals</h3>
                <p className="text-gray-600 dark:text-gray-400">Early access to Lightning Deals and exclusive member-only discounts.</p>
             </div>
             <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-gray-900">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold dark:text-white">Premium Support</h3>
                <p className="text-gray-600 dark:text-gray-400">Priority customer support for all your orders and technical questions.</p>
             </div>
          </div>

          <hr className="mb-20 border-gray-100 dark:border-gray-800" />

          {/* Plan Options - Flat Layout */}
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold dark:text-white">Choose your membership plan</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
               {plans.map((plan) => (
                 <div 
                    key={plan._id}
                    className={`flex flex-col border p-8 transition-colors ${
                        plan._id === featuredPlan?._id 
                        ? "border-[#ff9900] bg-white ring-1 ring-[#ff9900] dark:bg-gray-900" 
                        : "border-gray-200 bg-white hover:border-[#0066c0] dark:border-gray-800 dark:bg-gray-900"
                    }`}
                 >
                    <h3 className="mb-2 text-xl font-bold dark:text-white">{plan.name}</h3>
                    <div className="mb-4">
                        <span className="text-3xl font-bold dark:text-white">${plan.price}</span>
                        <span className="text-gray-500">/{plan.billingCycle === "monthly" ? "mo" : "yr"}</span>
                    </div>
                    <p className="mb-6 text-sm text-gray-500 h-10">{plan.description}</p>
                    
                    <ul className="mb-8 flex-grow space-y-3">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                                <Check className="h-4 w-4 flex-shrink-0 text-[#0066c0]" />
                                <span className="dark:text-gray-300">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => handleSubscribe(plan._id)}
                        disabled={processingId === plan._id}
                        className={`w-full rounded-sm py-2.5 font-semibold transition-all ${
                            plan._id === featuredPlan?._id
                            ? "bg-[#ff9900] hover:bg-[#ff8c00] text-black"
                            : "bg-[#f0f2f2] hover:bg-[#e7e9e9] text-black border border-[#d5d9d9]"
                        }`}
                    >
                        {processingId === plan._id ? (
                            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                        ) : (
                            `Choose ${plan.name}`
                        )}
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="bg-gray-100 py-12 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
            <Gift className="mx-auto mb-4 h-10 w-10 text-[#0066c0]" />
            <h2 className="mb-2 text-2xl font-bold dark:text-white">Give the gift of Membership</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">Share the benefits of premium with friends and family.</p>
            <button className="text-sm font-bold text-[#0066c0] hover:underline">Learn more about Gifting &gt;</button>
        </div>
      </section>
    </div>
  );
};

export default AmazonStyleSubscriptionPage;