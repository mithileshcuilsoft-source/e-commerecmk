"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const plans = [
  {
    id: "shopping",
    name: "Shopping Edition",
    price: 399,
    duration: "year",
  },
  {
    id: "lite",
    name: "Lite",
    price: 799,
    duration: "year",
  },

  {
    id: "premium",
    name: "Premium",
    price: 1499,
    duration: "year",
  },
];

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  useEffect(() => {
  fetchPlans();
}, []);

const fetchPlans = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/plans`
    );

    const data = await response.json();

    setPlans(data.data);

    if (data.data.length > 0) {
      setSelectedPlan(data.data[0]._id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const subscribe = async () => {
  try {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/checkout`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          planId: selectedPlan,
        }),
      }
    );

    const data =
      await response.json();

    if (data.url) {
      window.location.href =
        data.url;
    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-16">
      <div className="overflow-hidden rounded-3xl shadow-xl bg-white">

        <div className="grid lg:grid-cols-4">

          {/* Left Section */}
          <div className="bg-gradient-to-b from-blue-600 to-blue-900 text-white p-10 flex flex-col justify-center">

            <h1 className="text-4xl font-bold mb-4">
              Premium Membership
            </h1>

            <p className="text-lg mb-8">
              One membership, many benefits.
            </p>

            <div className="bg-yellow-400 text-black px-5 py-2 rounded-full inline-block font-bold w-fit">
              Become a Member Today
            </div>

            <div className="mt-10">
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
                alt=""
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-3 p-6 overflow-x-auto">
            <table className="w-full border-collapse">

              <thead>
                <tr>
                  <th className="text-left p-4">Features</th>

                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className={`p-4 border rounded-t-xl ${
                        selectedPlan === plan.id
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <div className="font-bold">
                        {plan.name}
                      </div>

                      <div className="text-blue-600 text-lg">
                        ₹{plan.price}
                      </div>

                      <div className="text-sm text-gray-500">
                        /{plan.duration}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                <FeatureRow
                  title="Free Delivery"
                  values={[true, true, true]}
                />

                <FeatureRow
                  title="Same Day Delivery"
                  values={[true, true, true]}
                />


                <FeatureRow
                  title="Premium Reading"
                  values={[false, false, true]}
                />

                <FeatureRow
                  title="Exclusive Discounts"
                  values={[true, true, true]}
                />

                <FeatureRow
                  title="Dedicated Support"
                  values={[false, false, true]}
                />

              </tbody>
            </table>

            {/* Plans */}
            <div className="mt-10 grid md:grid-cols-3 gap-4">

              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`
                  p-5 rounded-xl border transition-all text-left
                  ${
                    selectedPlan === plan.id
                      ? "border-blue-600 bg-blue-50 shadow-lg"
                      : "border-gray-300 bg-white"
                  }
                `}
                >
                  <h3 className="font-bold">
                    {plan.name}
                  </h3>

                  <div className="mt-3 text-2xl font-bold">
                    ₹{plan.price}
                  </div>

                  <p className="text-sm text-gray-500">
                    per {plan.duration}
                  </p>
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-end mt-8">
              <button
                onClick={subscribe}
                className="
                  bg-yellow-400
                  hover:bg-yellow-500
                  px-10
                  py-4
                  rounded-full
                  font-bold
                  text-black
                  transition
                "
              >
                Join Membership
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  title,
  values,
}: {
  title: string;
  values: boolean[];
}) {
  return (
    <tr className="border-t">
      <td className="p-4 font-medium">
        {title}
      </td>

      {values.map((value, idx) => (
        <td
          key={idx}
          className="text-center p-4"
        >
          {value ? (
            <Check className="w-5 h-5 text-green-600 mx-auto" />
          ) : (
            <X className="w-5 h-5 text-red-500 mx-auto" />
          )}
        </td>
      ))}
    </tr>
  );
}