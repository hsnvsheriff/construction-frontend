// src/dashboard/designer/sidebar/Plans.jsx (or wherever you keep it)
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios"; // ✅ will work again

const stripePromise = loadStripe("pk_test_51QouHyAXHT5Jd6c0Y1E2mRCSiNaSRE2yxhIQXfZsBwhwcNOzsrAKtWZMUcqWy9gE7HnTUldFjUHkCP9yop4pG3fE00OiUheCgl");

export default function Plans() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

const currentPlan = "Basic";
  const plans = [
    {
      name: "Basic",
      price: "$19/mo",
      amount: 19,
      features: [t("1 project"), t("Limited assets"), t("Email support")],
    },
    {
      name: "Pro",
      price: "$49/mo",
      amount: 49,
      features: [t("Unlimited projects"), t("Advanced assets"), t("Priority support")],
    },
    {
      name: "Platinum",
      price: "$129/mo",
      amount: 129,
      features: [t("Team collaboration"), t("AI tools"), t("Premium support"), t("Unlimited exports")],
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStripeCheckout = async (plan) => {
    const stripe = await stripePromise;
    try {
      const res = await axios.post("/api/payment/create-checkout-session", {
        name: plan.name,
        amount: plan.amount,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: res.data.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Stripe error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 px-6 py-12">
      <h1 className="text-3xl font-bold mb-10">{t("Your Plan & Pricing")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          const isUpgrade =
            plans.findIndex((p) => p.name === plan.name) >
            plans.findIndex((p) => p.name === currentPlan);

          return (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 shadow-sm transition ${
                isCurrent
                  ? "border-blue-600 dark:border-blue-400"
                  : "border-zinc-200 dark:border-zinc-700"
              } bg-zinc-100 dark:bg-zinc-900`}
            >
              <h2 className="text-xl font-semibold mb-2">{t(plan.name)}</h2>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
                {plan.price}
              </p>

              <ul className="mb-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="w-full bg-green-600 text-white py-2 rounded-md font-medium cursor-default">
                  {t("Current Plan")}
                </button>
              ) : (
                <button
                  onClick={() => handleStripeCheckout(plan)}
                  className={`w-full py-2 rounded-md font-medium ${
                    isUpgrade
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-zinc-300 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-400 dark:hover:bg-zinc-600"
                  } transition`}
                >
                  {isUpgrade ? t("Upgrade") : t("Downgrade")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
