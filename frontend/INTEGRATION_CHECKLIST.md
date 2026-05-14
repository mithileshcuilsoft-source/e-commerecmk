# Integration Checklist - Apply to Your Existing Code

## Step-by-Step to Integrate Protected Routes

### ✅ Step 1: Update Your Login Page
**File: `features/auth/login.tsx` or wherever your login form is**

```tsx
"use client";

import { useAuth } from "@/features/context/authContext";
import { publicApiPost } from "@/utils/proxy";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Call your backend login endpoint
      const response = await publicApiPost("/api/auth/login", {
        email,
        password,
      });

      // IMPORTANT: Call login from auth context to save user data
      login(response.token, response.user);

      toast.success("Logged in successfully!");

      // Redirect to home page
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### ✅ Step 2: Update Your Signup Page
**File: `features/auth/signUp.tsx`**

```tsx
"use client";

import { useAuth } from "@/features/context/authContext";
import { publicApiPost } from "@/utils/proxy";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export function SignupForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Call your backend signup endpoint
      const response = await publicApiPost("/api/auth/signup", formData);

      // Save user data
      login(response.token, response.user);

      toast.success("Account created successfully!");

      // Redirect to home page
      router.push("/");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### ✅ Step 3: Protect Orders Page
**File: `app/orders/page.tsx`**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Your existing content component
import OrdersPageContent from "./OrdersPageContent";

export default function OrdersPage() {
  return (
    <ProtectedRoute message="Please login first to view your orders.">
      <OrdersPageContent />
    </ProtectedRoute>
  );
}
```

### ✅ Step 4: Protect Cart Page
**File: `app/cart/page.tsx`**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Your existing content component
import CartPageContent from "./CartPageContent";

export default function CartPage() {
  return (
    <ProtectedRoute message="Please login first to view your cart.">
      <CartPageContent />
    </ProtectedRoute>
  );
}
```

### ✅ Step 5: Protect Checkout Page
**File: `app/checkout/page.tsx`**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Your existing content component
import CheckoutPageContent from "./CheckoutPageContent";

export default function CheckoutPage() {
  return (
    <ProtectedRoute message="Please login first to checkout.">
      <CheckoutPageContent />
    </ProtectedRoute>
  );
}
```

### ✅ Step 6: Protect Addresses Page
**File: `app/addresses/page.tsx`**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Your existing content component
import AddressesPageContent from "./AddressesPageContent";

export default function AddressesPage() {
  return (
    <ProtectedRoute message="Please login first to manage addresses.">
      <AddressesPageContent />
    </ProtectedRoute>
  );
}
```

### ✅ Step 7: Protect Profile Page
**File: `app/profile/page.tsx`**

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Your existing content component
import ProfilePageContent from "./ProfilePageContent";

export default function ProfilePage() {
  return (
    <ProtectedRoute message="Please login first to view your profile.">
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
```

### ✅ Step 8: Update Product Card (Add to Cart)
**File: `features/products/productCards.tsx`**

```tsx
"use client";

import { useCallProtectedApi } from "@/hooks/useCallProtectedApi";
import { apiPost } from "@/utils/proxy";
import { useState } from "react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

export function ProductCard({ product }: { product: Product }) {
  const { call, isLoading } = useCallProtectedApi();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const result = await call(
      () =>
        apiPost("/api/cart/add", {
          productId: product._id,
          quantity,
        }),
      {
        errorMessage: "Please login first to add items to cart.",
        successMessage: "Added to cart!",
      }
    );

    if (result) {
      // Optional: Refresh cart data or update UI
      setQuantity(1); // Reset quantity
    }
  };

  return (
    <div className="product-card">
      <img src={product.images?.[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>

      <div className="quantity">
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          min="1"
        />
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="add-to-cart-btn"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
```

### ✅ Step 9: Update Navbar with User Info
**File: `components/Navbar.tsx`**

```tsx
"use client";

import { useAuth } from "@/features/context/authContext";
import Link from "next/link";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link href="/">Logo</Link>

      <div className="nav-links">
        <Link href="/products/all-products">Products</Link>

        {isLoggedIn ? (
          <>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/profile">Profile</Link>

            <div className="user-menu">
              <span>Welcome, {user?.name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

### ✅ Step 10: Update API Files
**File: `api/cart/index.tsx`**

```tsx
import { apiGet, apiPost, apiDelete, apiPut } from "@/utils/proxy";

// Add to cart
export async function addToCart(productId: string, quantity: number = 1) {
  return apiPost("/api/cart/add", { productId, quantity });
}

// Get user cart
export async function getCart() {
  return apiGet("/api/cart");
}

// Remove item from cart
export async function removeFromCart(itemId: string) {
  return apiDelete(`/api/cart/item/${itemId}`);
}

// Update cart item quantity
export async function updateCartItem(itemId: string, quantity: number) {
  return apiPut(`/api/cart/item/${itemId}`, { quantity });
}

// Clear entire cart
export async function clearCart() {
  return apiDelete("/api/cart");
}
```

**File: `api/order/index.tsx`**

```tsx
import { apiGet, apiPost } from "@/utils/proxy";

// Get user's orders
export async function getOrders() {
  return apiGet("/api/orders");
}

// Get order details
export async function getOrderById(orderId: string) {
  return apiGet(`/api/orders/${orderId}`);
}

// Create new order
export async function createOrder(orderData: any) {
  return apiPost("/api/orders", orderData);
}
```

**File: `api/address/index.tsx`**

```tsx
import { apiGet, apiPost, apiDelete, apiPut } from "@/utils/proxy";

// Get user addresses
export async function getAddresses() {
  return apiGet("/api/addresses");
}

// Add new address
export async function addAddress(addressData: any) {
  return apiPost("/api/addresses", addressData);
}

// Update address
export async function updateAddress(addressId: string, addressData: any) {
  return apiPut(`/api/addresses/${addressId}`, addressData);
}

// Delete address
export async function deleteAddress(addressId: string) {
  return apiDelete(`/api/addresses/${addressId}`);
}
```

---

## 🎯 Summary

After following these steps, your app will have:

✅ **Route Protection**
- Users can't access protected pages without login
- Automatic redirect to login page

✅ **API Protection**
- All API calls check for login automatically
- Toast message shown if user tries protected API without login
- Auth token sent automatically with protected requests

✅ **User Experience**
- Users see "Please login first" message
- Navbar shows login/logout buttons based on auth status
- Smooth login/logout flow
- Session persistence (user stays logged in on refresh)

---

## 🧪 Testing Checklist

After integrating:

- [ ] Try accessing `/orders` without login → Should redirect to login
- [ ] Try clicking "Add to Cart" without login → Should show message and redirect
- [ ] Login successfully → Should redirect to home
- [ ] After login, access `/orders` → Should work
- [ ] Click logout → Should redirect to login page
- [ ] Refresh page while logged in → Should stay logged in
- [ ] Check Network tab → Should see `Authorization: Bearer [token]` in API calls

---

## ❓ Common Questions

**Q: Do I need to update every page?**
A: No, only the protected pages. Public pages (home, login, signup) work as-is.

**Q: What if my API endpoint is different?**
A: Change the URL in the API function. E.g., `/api/auth/login` to `/auth/login`

**Q: How do I add more protected pages?**
A: Same pattern - wrap with `<ProtectedRoute>` component.

**Q: Can I customize the error messages?**
A: Yes! Pass `message` prop to `<ProtectedRoute>` or `errorMessage` to `useCallProtectedApi()`.

**Q: How do I show user profile picture?**
A: Add `image` field to user object during login, then use `user?.image` in components.
