"use client";

import { TSummaryProposal } from "@/app/types";
import {
  allocate,
  getMaxVoiceCreditsPerAllocator,
  getVoiceCreditsCastByAllocator,
} from "../../utils/alloContract";
import CartItem from "./CartItem";
import { useTranslations } from "next-intl";
import { useCart } from "@/app/context/CartContext";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

const CartList = ({ cartItems }: { cartItems: TSummaryProposal[] }) => {
  const t = useTranslations("My Cart");
  const { user, ready, sendTransaction } = usePrivy();
  const { allocations } = useCart();

  const [maxVoiceCreditsPerAllocator, setMaxVoiceCreditsPerAllocator] =
    useState(0);
  const [voiceCreditsUsedByAllocator, setVoiceCreditsUsedByAllocator] =
    useState(0);

  useEffect(() => {
    // Fetch maxVoiceCreditsPerAllocator data
    async function fetchMaxVoiceCreditsPerAllocator() {
      try {
        const data = await getMaxVoiceCreditsPerAllocator();
        setMaxVoiceCreditsPerAllocator(data);
      } catch (error) {
        // Handle error
        console.error("Error fetching maxVoiceCreditsPerAllocator:", error);
      }
    }

    // Fetch voiceCreditsUsedByAllocator data
    async function fetchVoiceCreditsUsedByAllocator() {
      try {
        const data = await getVoiceCreditsCastByAllocator(
          user!.wallet!.address
        );
        setVoiceCreditsUsedByAllocator(data);
      } catch (error) {
        // Handle error
        console.error("Error fetching voiceCreditsUsedByAllocator:", error);
      }
    }

    // Call both functions to fetch data
    fetchMaxVoiceCreditsPerAllocator();
    fetchVoiceCreditsUsedByAllocator();
  }, [user]); // Dependencies array - re-run when user.wallet.address changes

  if (!ready || !user || !user.wallet) return null;

  const onButtonClick = async () => {
    const unsignedTx = allocate(allocations);
    await sendTransaction(unsignedTx);

    window.location.reload();
  };

  return (
    <div className="text-center">
      <p className="text-sm text-center mb-2">
        You have {cartItems.length}
        {cartItems.length > 1 ? " items " : " item "} in your cart.
      </p>
      <p className="text-sm text-center mb-4">
        You have {maxVoiceCreditsPerAllocator - voiceCreditsUsedByAllocator}{" "}
        voice credits left
      </p>

      <div>
        {cartItems.map((item, index) => (
          <div
            key={"cartItem-" + index}
            className=" border rounded-md shadow-sm bg-gray-50 mb-5"
          >
            <CartItem item={item} />
          </div>
        ))}
      </div>
      <div>
        <button
          onClick={onButtonClick}
          className="w-full border border-slate-400 hover:bg-sky-600 rounded-md leading-10 font-bold"
        >
          {t("checkoutButton")}
        </button>
        {Object.values(allocations)
          .map((value) => Number(value))
          .reduce((a, b) => a + b, 0) >
          maxVoiceCreditsPerAllocator - voiceCreditsUsedByAllocator && (
          <p className="text-red-500">Error: Not enough voice credits left.</p>
        )}
      </div>

      <div className="mt-8 text-left text-sm">
        <h3 className="font-semibold mb-3">Voting with Voice Credits</h3>
        <p>At Impact Stream we value your opinion and want to make your voting experience even more impactful. You have the opportunity to vote for your favorite projects using a unique system called "quadratic voting."</p>

        <h4 className="font-semibold mt-5 mb-2">Voice Credits:</h4>
        <ul className="list-disc p-3 m-auto">
          <li className="mb-2">Each user is provided with 10 Voice Credits.</li>
          <li className="mb-2">These Voice Credits are your currency for voting.</li>
          <li className="mb-2">You can allocate these credits across the projects you support.</li>
        </ul>

        <h4 className="font-semibold mt-2 mb-2">Quadratic Voting:</h4>
        <ul className="list-disc p-3 m-auto">
          <li className="mb-2">Quadratic voting allows you to emphasize the projects that matter most to you.</li>
          <li className="mb-2">When you vote for a project, the cost of your vote increases quadratically with each additional vote.</li>
          <li className="mb-2">The more Voice Credits you allocate to a single project, the more impactful your vote becomes.</li>
          <li className="mb-2">Use your Voice Credits wisely to make a significant impact on your favorite projects.</li>
        </ul>

        <h4 className="font-semibold mt-2 mb-2">Why Quadratic Voting:</h4>
        <ul className="list-disc p-3 m-auto">
          <li className="mb-2">Quadratic voting promotes fairness and encourages users to focus on the projects they're most passionate about.</li>
          <li className="mb-2">It enables a more balanced distribution of Voice Credits, ensuring that popular projects receive more attention while still allowing users to support multiple projects.</li>
        </ul>

        <p>Now, you're ready to make a difference! Allocate your Voice Credits strategically and support the projects that you believe in the most.</p>

        <p className="mt-5">Thank you for being part of our community and for making your voice heard!</p>
      </div>
    </div>
  );
};

export default CartList;
