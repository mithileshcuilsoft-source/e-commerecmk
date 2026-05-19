"use client";

import Link from "next/link";

import React from "react";

import { useCartStore } from "@/store/useCartStore";

const CartPage = () => {
 const cart = useCartStore((state) => state.cart);
 
 const loading =useCartStore((state) => state.loading);

 const removeFromCart =useCartStore((state) => state.removeFromCart);

  const increaseQty = useCartStore((state) => state.increaseQty);

  const decreaseQty =useCartStore((state) =>state.decreaseQty);

  const clearCart = useCartStore((state) =>state.clearCart);

  const total = cart.reduce((sum, item) => {
      return (
        sum +
        item.productId.price *
          item.quantity
      );
    },
    0
  );

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">

      <h1 className="mb-6 text-3xl font-bold">
        Your Cart
      </h1>

      {cart.length === 0 ? (

        <div className="space-y-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

          <p className="text-gray-500">
            Your cart is empty.
          </p>

          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Continue shopping
          </Link>

        </div>

      ) : (
        <>

          <div className="space-y-4">

            {cart.map((item) => (

              <div
                key={item._id}
                className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[4rem_1fr_auto]"
              >

                {/* IMAGE */}
                <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100">

                  {item.productId
                    .images?.[0] ? (

                    <img
                      src={
                        item.productId
                          .images[0]
                      }
                      alt={
                        item.productId
                          .name
                      }
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div className="space-y-2">

                  <h2 className="text-lg font-semibold">
                    {
                      item.productId
                        .name
                    }
                  </h2>

                  <p className="text-sm text-gray-500">
                    ₹
                    {
                      item.productId
                        .price
                    }{" "}
                    each
                  </p>

                  <div className="flex items-center gap-2">

                    <button
                      onClick={() =>
                        decreaseQty(
                          item._id,
                          item.quantity
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="min-w-[2rem] text-center">
                      {
                        item.quantity
                      }
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(
                          item._id,
                          item.quantity
                        )
                      }
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col items-end justify-between text-right">

                  <button
                    onClick={() =>
                      removeFromCart(
                        item._id
                      )
                    }
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>

                  <p className="font-semibold">
                    ₹
                    {(
                      item.productId
                        .price *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Order summary
                </h2>

                <p className="text-sm text-gray-500">
                  {cart.length} item
                  {cart.length > 1
                    ? "s"
                    : ""}{" "}
                  in your cart
                </p>

              </div>

              <div className="space-y-2 text-right">

                <p className="text-lg font-semibold">
                  Total: ₹
                  {total.toFixed(
                    2
                  )}
                </p>

                <Link
                  href="/checkout"
                  className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
                >
                  Proceed to Checkout
                </Link>

              </div>
            </div>

            {/* CLEAR CART */}
            <button
              onClick={clearCart}
              className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-500"
            >
              Clear Cart
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;