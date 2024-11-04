import { useState } from "react";
import campaign from "../../../ethereum/campaign";
import web3 from "../web3"; // Ensure you import web3
import { useRouter } from "next/navigation";

function ContributeForm({ address }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const campaignInstance = campaign(address);

    try {
      setIsLoading(true);
      setError(""); // Clear previous error

      const accounts = await web3.eth.getAccounts();

      // Whenever we call this send method we need to pass the value in wei
      await campaignInstance.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, "ether"),
      });

      // Reset amount after successful contribution
      setAmount("");
      router.refresh(); // Refresh the current page
    } catch (error) {
      console.error("Error contributing to campaign:", error);
      setError("Failed to contribute. Please check the amount and try again."); // Set a user-friendly error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">
        Contribute to the Campaign
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex flex-row">
          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border text-gray-500 border-gray-300 rounded-l-lg p-2 mb-4 w-full"
            required
          />
          <span className="bg-black text-white rounded-r-lg px-4 py-2 mb-4">
            ETH
          </span>
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-200 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? "Contributing..." : "Contribute"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}{" "}
        {/* Display error message */}
      </form>
    </div>
  );
}

export default ContributeForm;
