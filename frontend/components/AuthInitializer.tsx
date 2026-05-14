// "use client";

// import { useEffect } from "react";

// import { useAuthStore } from "@/store/useAuthStore";

// const AuthInitializer = () => {

//   const loadUser =
//     useAuthStore(
//       (state) => state.loadUser
//     );

//   useEffect(() => {

//     loadUser();

//   }, [loadUser]);

//   return null;
// };

// export default AuthInitializer;
"use client";

import { useEffect } from "react";

import { useCartStore } from "@/store/useCartStore";

const CartInitializer = () => {

  const fetchCart =
    useCartStore(
      (state) =>
        state.fetchCart
    );

  useEffect(() => {

    fetchCart();

  }, [fetchCart]);

  return null;
};

export default CartInitializer;