"use client";
import { useState } from "react";
import factory from "../../../../ethereum/factory";
import web3 from "../../../../ethereum/web3";
import { useRouter } from "next/navigation";

function Page() {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize the router

  const handleChange = (e) => {
    setMinimumContribution(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous message
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(minimumContribution)
        .send({ from: accounts[0] });
      setMessage("Campaign created successfully!");
      router.push("/"); // Redirect to the root page on success
    } catch (error) {
      console.error("Error creating campaign:", error.message);
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Campaign
      </h1>

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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <label className="block text-gray-700 text-lg font-medium mb-2">
          Minimum Contribution (wei)
        </label>
        <input
          type="number"
          value={minimumContribution}
          onChange={handleChange}
          placeholder="Enter amount in wei"
          className="w-full px-4 py-2 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8-8z"
                ></path>
              </svg>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}

export default Page;
