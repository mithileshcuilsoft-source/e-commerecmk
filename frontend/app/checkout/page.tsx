"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {
  createOrder,
  calculateCheckout,
} from "@/api/order";

import { getAddresses } from "@/api/address";

import { useCartStore } from "@/store/useCartStore";

const CheckoutPage = () => {

  const router = useRouter();

  const cart = useCartStore((state) => state.cart);

  const clearCart = useCartStore((state) =>state.clearCart);
  const [addresses, setAddresses] = useState<any[]>([]);

  const [selectedAddressId,setSelectedAddressId,] = useState("");

  const [paymentMethod,setPaymentMethod,] = useState("cash_on_delivery");

  const [notes, setNotes] =useState("");

  const [loading, setLoading] =useState(false);

  const [checkoutLoading,setCheckoutLoading,] = useState(false);

  const [error, setError] =useState("");

  const [success, setSuccess] =useState("");

  const [checkoutData,setCheckoutData,] = useState<any>(null);

  useEffect(() => {

    const loadAddresses =
      async () => {

        try {
            const data =await getAddresses();
            setAddresses(data);

          if (
            data.length > 0
          ) {

            const defaultAddress =data.find((address: any) =>
                  address.isDefault
              );

            setSelectedAddressId(
              defaultAddress?._id ||
                data[0]._id
            );
          }

        } catch (err) {

          console.error(err);
        }
      };

    loadAddresses();

  }, []);
  useEffect(() => {

    const loadCheckout =async () => {
      if (
          !cart ||
          cart.length === 0
        ) {

          setCheckoutData({
            items: [],
            subtotal: 0,
            tax: 0,
            shippingCost: 0,
            discount: 0,
            total: 0,
          });

          return;
        }

        try {

          setCheckoutLoading(true);

          const data =
            await calculateCheckout(
              {
                items: cart.map(
                  (item) => ({
                    productId:
                      item
                        .productId
                        ._id,

                    quantity:
                      item.quantity,

                    variant:
                      item.variant,
                  })
                ),
              }
            );

          setCheckoutData(
            data
          );

        } catch (err) {

          console.error(
            "Checkout load failed:",
            err
          );

        } finally {

          setCheckoutLoading(
            false
          );
        }
      };

    loadCheckout();

  }, [cart]);

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError("");

      setSuccess("");
      if (
        cart.length === 0
      ) {

        setError(
          "Your cart is empty."
        );

        return;
      }
      if (
        !selectedAddressId
      ) {

        setError(
          "Please select shipping address."
        );

        return;
      }

      setLoading(true);

      try {

        const orderPayload =
          {
            items: cart.map(
              (item) => ({
                productId:
                  item
                    .productId
                    ._id,

                quantity:
                  item.quantity,

                variant:
                  item.variant,
              })
            ),

            shippingAddress:
              selectedAddressId,

            paymentMethod,

            notes,
          };

        await createOrder(
          orderPayload
        );
        await clearCart();
        setSuccess(
          "Order placed successfully."
        );
        router.push(
          "/orders"
        );

      } catch (err: any) {

        setError(
          err.response?.data
            ?.message ||
            "Checkout failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mx-auto max-w-5xl p-6"
    >

      <h1 className="mb-6 text-3xl font-bold">
        Checkout
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Shipping Address
            </h2>

            {addresses.length ===
            0 ? (

              <div>

                <p className="text-gray-500">
                  No address found.
                </p>

                <Link
                  href="/addresses"
                  className="text-blue-600"
                >
                  Add Address
                </Link>

              </div>

            ) : (

              <select
                value={
                  selectedAddressId
                }
                onChange={(e) =>
                  setSelectedAddressId(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border p-3"
              >

                {addresses.map(
                  (a) => (

                    <option
                      key={a._id}
                      value={a._id}
                    >
                      {a.street},{" "}
                      {a.city},{" "}
                      {a.state}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* PAYMENT */}
          <div className="rounded-2xl border p-6">

            <h2 className="mb-4 text-xl font-semibold">
              Payment Method
            </h2>

            <select
              value={
                paymentMethod
              }
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            >

              <option value="cash_on_delivery">
                Cash on Delivery
              </option>

              <option value="credit_card">
                Credit Card
              </option>

              <option value="debit_card">
                Debit Card
              </option>

              <option value="paypal">
                PayPal
              </option>

            </select>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              placeholder="Order notes..."
              className="mt-4 min-h-[120px] w-full rounded-xl border p-3"
            />

          </div>
        </section>

        {/* RIGHT */}
        <section className="rounded-2xl border bg-white p-6">

          <h2 className="mb-4 text-xl font-semibold">
            Order Summary
          </h2>

          {checkoutLoading ? (

            <p>
              Calculating
              checkout...
            </p>

          ) : (

            <>
              {checkoutData?.items?.map(
                (
                  item: any
                ) => (

                  <div
                    key={
                      item.productId
                    }
                    className="mb-2 flex justify-between"
                  >

                    <div>

                      <p>
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Qty:{" "}
                        {
                          item.quantity
                        }
                      </p>

                    </div>

                    <p>
                      ₹
                      {item.total.toFixed(
                        2
                      )}
                    </p>

                  </div>
                )
              )}

              <hr className="my-3" />

              <p>
                Subtotal: ₹
                {
                  checkoutData?.subtotal
                }
              </p>

              <p>
                Tax: ₹
                {checkoutData?.tax}
              </p>

              <p>
                Shipping:{" "}
                {checkoutData?.shippingCost ===
                0
                  ? "Free"
                  : `₹${checkoutData?.shippingCost}`}
              </p>

              <p className="mt-2 font-bold">
                Total: ₹
                {
                  checkoutData?.total
                }
              </p>

              {error && (

                <p className="text-red-500">
                  {error}
                </p>
              )}

              {success && (

                <p className="text-green-600">
                  {success}
                </p>
              )}

              <button
                disabled={
                  loading ||
                  cart.length ===
                    0
                }
                className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-500"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </>
          )}
        </section>
      </div>
    </form>
  );
};

export default CheckoutPage;