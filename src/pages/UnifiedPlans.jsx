import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import axios from "@/lib/axios"; // ✅ will work again

const stripePromise = loadStripe("pk_test_51QouHyAXHT5Jd6c0Y1E2mRCSiNaSRE2yxhIQXfZsBwhwcNOzsrAKtWZMUcqWy9gE7HnTUldFjUHkCP9yop4pG3fE00OiUheCgl");

const UnifiedPlans = () => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState("designer"); // default for testing
  const [mounted, setMounted] = useState(false);

  // Example: set role from Firestore or Auth
  useEffect(() => {
    setMounted(true);

    // Replace with your real auth logic
    const fakeUser = { role: "designer" }; // "construction", "supplier"
    setUserType(fakeUser.role || "guest");
  }, []);

  const planOptions = {
    designer: [
      { name: "Solo", price: "$29", amount: 29, features: ["1 project", "Basic support"] },
      { name: "Team", price: "$99", amount: 99, features: ["Unlimited projects", "Collaboration", "Priority support"] },
    ],
    construction: [
      { name: "Builder Pro", price: "$49", amount: 49, features: ["Unlimited walls", "Team tools"] },
      { name: "Enterprise Site", price: "$399", amount: 399, features: ["Advanced budgeting", "Full 3D viewer", "Collaborator control"] },
    ],
    supplier: [
      { name: "Premium Supplier", price: "$19", amount: 19, features: ["Top listing", "Priority orders"] },
      { name: "Verified Gold", price: "$99", amount: 99, features: ["Search priority", "Analytics tools"] },
    ],
  };

  const plans = planOptions[userType] || [];

  const currentPlan = "None"; // Replace with real current plan logic

  const handleStripeCheckout = async (plan) => {
    const stripe = await stripePromise;
    try {
      const res = await axios.post("/api/payment/create-checkout-session", {
        name: plan.name,
        amount: plan.amount,
        role: userType, // optional, for future webhook use
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
      <h1 className="text-3xl font-bold mb-10">{t("Choose Your Plan")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.name;

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
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{plan.price}</p>

              <ul className="mb-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                {plan.features.map((feature, i) => (
                  <li key={i}>✔ {t(feature)}</li>
                ))}
              </ul>

              {isCurrent ? (
                <button className="w-full bg-green-600 text-white py-2 rounded-md font-medium cursor-default">
                  {t("Current Plan")}
                </button>
              ) : (
                <button
                  onClick={() => handleStripeCheckout(plan)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
                >
                  {t("Upgrade")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UnifiedPlans;
