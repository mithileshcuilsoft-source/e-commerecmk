import { create } from "zustand";

import { persist } from "zustand/middleware";

import {
  addToCartApi,
  clearCartApi,
  getCart,
  removeCartItemApi,
  updateCartItemApi,
} from "@/api/cart";


type ProductType = {
  _id: string;

  name: string;

  price: number;

  images?: string[];

  stock: number;

  vendorBlocked?: boolean;

  available?: boolean;
};

export type CartItem = {
  _id: string;

  quantity: number;

  variant?: string;

  productId: ProductType;
};

interface CartState {

  cart: CartItem[];

  loading: boolean;

  fetchCart: () => Promise<void>;

  addToCart: (
    productId: string,
    quantity?: number,
    variant?: string
  ) => Promise<void>;

  removeFromCart: (
    itemId: string
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  increaseQty: (
    itemId: string,
    currentQty: number
  ) => Promise<void>;

  decreaseQty: (
    itemId: string,
    currentQty: number
  ) => Promise<void>;
}

// =========================
// STORE
// =========================

export const useCartStore =
  create<CartState>()(
    persist(
      (set) => ({

        cart: [],

        loading: false,

        // =========================
        // FETCH CART
        // =========================

        fetchCart: async () => {

          try {

            set({
              loading: true,
            });

            const token =
              typeof window !==
              "undefined"
                ? localStorage.getItem(
                    "token"
                  )
                : null;

            if (!token) {

              set({
                cart: [],
                loading: false,
              });

              return;
            }

            const data =
              await getCart();

            set({
              cart:
                data.items || [],
            });

          } catch (error) {

            console.error(error);

          } finally {

            set({
              loading: false,
            });
          }
        },

        // =========================
        // ADD TO CART
        // =========================

        addToCart: async (
          productId,
          quantity = 1,
          variant
        ) => {

          try {

            const data =
              await addToCartApi({
                productId,
                quantity,
                variant,
              });

            set({
              cart:
                data.cart?.items ||
                [],
            });

          } catch (error) {

            console.error(error);
          }
        },

        // =========================
        // REMOVE ITEM
        // =========================

        removeFromCart:
          async (itemId) => {

            try {

              const data =
                await removeCartItemApi(
                  itemId
                );

              set({
                cart:
                  data.cart?.items ||
                  [],
              });

            } catch (error) {

              console.error(error);
            }
          },

        // =========================
        // INCREASE QTY
        // =========================

        increaseQty:
          async (
            itemId,
            currentQty
          ) => {

            try {

              const data =
                await updateCartItemApi(
                  itemId,
                  currentQty + 1
                );

              set({
                cart:
                  data.items ||
                  data.cart?.items ||
                  [],
              });

            } catch (error) {

              console.error(error);
            }
          },

        // =========================
        // DECREASE QTY
        // =========================

        decreaseQty:
          async (
            itemId,
            currentQty
          ) => {

            try {

              if (
                currentQty <= 1
              ) {

                const data =
                  await removeCartItemApi(
                    itemId
                  );

                set({
                  cart:
                    data.cart?.items ||
                    [],
                });

                return;
              }

              const data =
                await updateCartItemApi(
                  itemId,
                  currentQty - 1
                );

              set({
                cart:
                  data.items ||
                  data.cart?.items ||
                  [],
              });

            } catch (error) {

              console.error(error);
            }
          },

        // =========================
        // CLEAR CART
        // =========================

        clearCart: async () => {

          try {

            const data =
              await clearCartApi();

            set({
              cart:
                data.cart?.items ||
                [],
            });

          } catch (error) {

            console.error(error);
          }
        },
      }),

      // =========================
      // PERSIST
      // =========================

      {
        name: "cart-storage",
      }
    )
  );