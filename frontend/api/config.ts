const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

if (typeof window !== "undefined") {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined! Falling back to localhost:5000");
  }
}

export const config = {
  apiUrl: API_URL,
  frontendUrl: FRONTEND_URL,
  stripePublishableKey: STRIPE_PUBLISHABLE_KEY,
  endpoints: {
    auth: "/auth",
    users: "/users",
    products: "/products",
    orders: "/orders",
    cart: "/cart",
    subscription: "/subscription",
    payment: "/payment",
  }
};
