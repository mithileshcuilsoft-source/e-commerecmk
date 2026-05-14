# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Frontend App                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                        │ │
│  │  ┌──────────────────────────────────────────────────┐     │ │
│  │  │ Check: Is token in cookies?                      │     │ │
│  │  │ Route: Public (/login, /signup) or Protected?    │     │ │
│  │  │ Action: Allow or Redirect to Login               │     │ │
│  │  └──────────────────────────────────────────────────┘     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                 AuthProvider Context                       │ │
│  │  ┌──────────────────────────────────────────────────┐     │ │
│  │  │ State:                                           │     │ │
│  │  │  • user (User info)                             │     │ │
│  │  │  • token (Auth token)                           │     │ │
│  │  │  • isLoggedIn (Boolean)                         │     │ │
│  │  │                                                  │     │ │
│  │  │ Methods:                                         │     │ │
│  │  │  • login(token, user)                           │     │ │
│  │  │  • logout()                                      │     │ │
│  │  │  • checkAuth()                                   │     │ │
│  │  └──────────────────────────────────────────────────┘     │ │
│  │                         ↓                                   │ │
│  │                   useAuth() Hook                            │ │
│  │             (Available in all components)                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Component/Page Layer                          │ │
│  │                                                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐             │ │
│  │  │Protected │  │  Login   │  │ProductCard   │             │ │
│  │  │Route     │  │ Component│  │Component     │             │ │
│  │  │Wrapper   │  │          │  │              │             │ │
│  │  └──────────┘  └──────────┘  └──────────────┘             │ │
│  │                                                             │ │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐           │ │
│  │  │useAuth()   │  │useCall     │  │useProtected│           │ │
│  │  │hook        │  │ProtectedApi│  │Api hook    │           │ │
│  │  └────────────┘  └────────────┘  └────────────┘           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   API Layer (utils/proxy.ts)               │ │
│  │                                                             │ │
│  │  Protected APIs              Public APIs                   │ │
│  │  ┌─────────────┐              ┌─────────────┐             │ │
│  │  │ apiGet()    │              │publicApiGet │             │ │
│  │  │ apiPost()   │              │publicApiPost│             │ │
│  │  │ apiPut()    │              └─────────────┘             │ │
│  │  │ apiDelete() │                                           │ │
│  │  └─────────────┘                                           │ │
│  │       ↓                              ↓                      │ │
│  │  Checks login                  No check                    │ │
│  │  Adds token                    Direct call                 │ │
│  │  Shows message                                             │ │
│  │  Redirects if needed                                       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              ↓                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Auth Utilities (utils/auth.ts)                │ │
│  │                                                             │ │
│  │  • isUserLoggedIn()  - Check login status                 │ │
│  │  • getToken()        - Get auth token                      │ │
│  │  • getUser()         - Get user info                       │ │
│  │  • setAuthData()     - Save auth data                      │ │
│  │  • clearAuthData()   - Clear auth data                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Backend API Server
                  (http://localhost:5000)
```

---

## Data Flow

### Login Flow

```
┌──────────────┐
│  User Input  │ (email, password)
└──────┬───────┘
       ↓
┌──────────────────────────────────────┐
│  Login Component (features/auth/)    │
│  - Get form data                     │
│  - Call publicApiPost()              │
└──────────────────┬───────────────────┘
                   ↓
          ┌────────────────────┐
          │ proxy.ts           │
          │ publicApiPost()    │
          │ - No auth check    │
          │ - Make API call    │
          └────────┬───────────┘
                   ↓
          ┌────────────────────┐
          │  Backend API       │
          │  /api/auth/login   │
          │  ✓ Valid?          │
          │  → Return token    │
          └────────┬───────────┘
                   ↓
          ┌────────────────────────┐
          │  Response Handler      │
          │  {token, user}         │
          │  ↓                     │
          │  Call login() from     │
          │  useAuth context       │
          └────────┬───────────────┘
                   ↓
          ┌────────────────────────┐
          │  Auth Context          │
          │  - Save token          │
          │  - Save user info      │
          │  - Update isLoggedIn   │
          │  - Save to localStorage│
          └────────┬───────────────┘
                   ↓
          ┌────────────────────────┐
          │  Navigate Home         │
          │  Redirect to /         │
          └────────────────────────┘
```

### Protected API Call Flow

```
┌────────────────────────────┐
│ User Action                │
│ (Click "Add to Cart")      │
└────────┬───────────────────┘
         ↓
┌────────────────────────────────────┐
│ Component (ProductCard)            │
│ - useCallProtectedApi hook         │
│ - call() function                  │
└────────┬───────────────────────────┘
         ↓
┌────────────────────────────────────┐
│ Hook: useCallProtectedApi          │
│ - Check: isUserLoggedIn()?         │
└────┬──────────────────────────┬────┘
     │ NOT LOGGED IN            │ LOGGED IN
     ↓                          ↓
┌──────────────┐      ┌────────────────────┐
│ Show Toast   │      │ Proxy API Call     │
│ "Please      │      │ apiPost()          │
│  login first"│      │ - Add token header │
│ ↓            │      │ - Send request     │
│ Redirect to  │      └────────┬───────────┘
│ /auth/login  │               ↓
└──────────────┘      ┌────────────────────┐
                      │ Backend Check      │
                      │ - Token valid?     │
                      │ - User authorized? │
                      └────────┬───────────┘
                               ↓
                      ┌────────────────────┐
                      │ Backend Success    │
                      │ Add to cart        │
                      │ Return success     │
                      └────────┬───────────┘
                               ↓
                      ┌────────────────────┐
                      │ Front-end Handler  │
                      │ - Show success msg │
                      │ - Update cart UI   │
                      └────────────────────┘
```

### Route Protection Flow

```
┌──────────────────┐
│ User URL         │
│ /orders          │
└────────┬─────────┘
         ↓
┌──────────────────────────────┐
│ Middleware                   │
│ - Extract token from cookies │
│ - Check route type           │
└────────┬─────────────────────┘
         ↓
    ┌────┴────┐
    │          │
NO TOKEN      HAS TOKEN
    │          │
    ↓          ↓
Redirect    Allow
to login    Route
/auth/login
```

---

## Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                     App Providers                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  AuthProvider                                     │  │
│  │  ├── Provides: user, token, login, logout        │  │
│  │  │                                               │  │
│  │  │  ┌────────────────────────────────────────┐  │  │
│  │  │  │  CartProvider                         │  │  │
│  │  │  │  ├── Provides: cart, addToCart        │  │  │
│  │  │  │  │                                    │  │  │
│  │  │  │  │  ┌──────────────────────────────┐ │  │  │
│  │  │  │  │  │ App Content                  │ │  │  │
│  │  │  │  │  │                              │ │  │  │
│  │  │  │  │  │  Navbar                      │ │  │  │
│  │  │  │  │  │  ├── Uses: useAuth()         │ │  │  │
│  │  │  │  │  │  └── Shows user info         │ │  │  │
│  │  │  │  │  │                              │ │  │  │
│  │  │  │  │  │  Pages                       │ │  │  │
│  │  │  │  │  │  ├── /orders                 │ │  │  │
│  │  │  │  │  │  │   └── ProtectedRoute      │ │  │  │
│  │  │  │  │  │  │       └── OrdersContent   │ │  │  │
│  │  │  │  │  │  │           └── Uses useAuth│ │  │  │
│  │  │  │  │  │  │                           │ │  │  │
│  │  │  │  │  │  ├── /cart                   │ │  │  │
│  │  │  │  │  │  │   └── CartContent         │ │  │  │
│  │  │  │  │  │  │       └── useCart hook    │ │  │  │
│  │  │  │  │  │  │                           │ │  │  │
│  │  │  │  │  │  └── /products               │ │  │  │
│  │  │  │  │  │      └── ProductCard         │ │  │  │
│  │  │  │  │  │          └── useCallProtected│ │  │  │
│  │  │  │  │  │              Api()            │ │  │  │
│  │  │  │  │  │                              │ │  │  │
│  │  │  │  │  └──────────────────────────────┘ │  │  │
│  │  │  │  └────────────────────────────────────┘  │  │
│  │  │  └───────────────────────────────────────────┘  │
│  │  └──────────────────────────────────────────────┘  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## API Request Flow with Authentication

```
Frontend Component
       ↓
┌─────────────────────────────┐
│ API Function Call           │
│ apiPost("/api/cart/add", {})│
└──────────┬──────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Proxy Request Interceptor               │
│ ┌─────────────────────────────────────┐ │
│ │ Get token from storage              │ │
│ │ Add to headers:                      │ │
│ │ Authorization: Bearer [token]        │ │
│ │ Content-Type: application/json       │ │
│ └─────────────────────────────────────┘ │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ HTTP Request Sent to Backend            │
│ POST /api/cart/add                      │
│ Headers:                                │
│  Authorization: Bearer eyJhbGc...       │
│ Body:                                   │
│  {productId: "123", quantity: 1}        │
└──────────┬──────────────────────────────┘
           ↓
Backend Server Processes
           ↓
┌─────────────────────────────────────────┐
│ HTTP Response Received                  │
│ Status: 200 OK / 401 Unauthorized       │
│ Body: {...}                             │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Response Interceptor                    │
│ Check status:                           │
│ - 401? Clear auth & redirect to login   │
│ - 200? Return data to component         │ │
└──────────┬──────────────────────────────┘
           ↓
Component Receives Result
Update UI / Show Message
```

---

## State Management

```
Local Storage (Browser)
├── token: "eyJhbGc..."
└── user: {_id, email, name, role}
           ↑
           │
    (Synced by)
           │
           ↓
Auth Context (React)
├── token: string
├── user: User object
├── isLoggedIn: boolean
├── isLoading: boolean
├── login(): void
├── logout(): void
└── checkAuth(): void
           ↑
           │
    (Accessed by)
           │
           ↓
Components/Hooks
├── useAuth()
├── useCallProtectedApi()
├── useProtectedApi()
└── Auth utilities
```

---

## Security Layers

```
1. Middleware Layer
   └── Blocks unauthenticated route access
   └── Stores redirect URL for post-login

2. Component Layer
   └── ProtectedRoute wrapper
   └── Checks authentication before rendering

3. API Layer (Proxy)
   └── Checks login before API call
   └── Shows message and redirects if not logged in
   └── Sends token with protected requests
   └── Auto-logout on 401

4. Hook Layer
   └── useCallProtectedApi for API protection
   └── useProtectedApi for advanced protection
   └── Custom auth checks in components

5. Backend Layer
   └── Token validation
   └── User authorization
   └── Server-side protection
```

---

## File Dependencies

```
middleware.ts
    ↓
Layout.tsx (needs AuthProvider)
    ↓
App Components
    ├── useAuth (needs AuthProvider)
    ├── useCallProtectedApi
    │   ├── utils/auth.ts
    │   └── utils/proxy.ts
    ├── ProtectedRoute
    │   ├── utils/auth.ts
    │   └── navigation
    └── useProtectedApi
        ├── utils/auth.ts
        └── utils/proxy.ts

utils/proxy.ts
    └── utils/auth.ts

All API calls
    └── utils/proxy.ts (apiGet, apiPost, etc)
```

---

## Summary

The system creates **multiple layers of protection**:

1. **Middleware** - Route level protection
2. **Components** - Component level protection
3. **Hooks** - API call level protection
4. **Utilities** - Auth state management
5. **Context** - Global state for entire app

**Result:** A secure, user-friendly e-commerce app with clear error messages and smooth authentication flow!
