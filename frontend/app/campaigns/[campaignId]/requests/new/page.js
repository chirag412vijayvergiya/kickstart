"use client";

import { useParams, useRouter } from "next/navigation";
import campaign from "./../../../../../../ethereum/campaign";
import web3 from "../../../../web3";
import { useState } from "react";

function Page() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { campaignId } = useParams();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const accounts = await web3.eth.getAccounts();
      const campaignInstance = campaign(campaignId);

      await campaignInstance.methods
        .createRequest(
          description,
          web3.utils.toWei(amount, "ether"),
          recipient
        )
        .send({ from: accounts[0] });

      setMessage("Request created successfully!");
      router.push(`/campaigns/${campaignId}/requests`);
    } catch (error) {
      console.error("Error creating request:", error.message);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 p-6">
      <button
        onClick={handleBack}
        className="self-start mb-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
      >
        &#x2190; Back
      </button>

      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Create A Request
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full text-gray-500 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="amount"
          >
            Amount (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in Ether"
            className="w-full text-gray-500 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="recipient"
          >
            Recipient
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
            className="w-full text-gray-500 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>

        {message && (
          <div
            className={`p-4 mb-4 rounded-lg text-white ${
              message.toLowerCase().includes("error")
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            ⚠️ {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default Page;
