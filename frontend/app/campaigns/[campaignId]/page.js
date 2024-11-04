"use client";
import { useParams } from "next/navigation";
import Campaign from "../../../../ethereum/campaign";
import { useState, useEffect } from "react";
// import web3 from "../../../../ethereum/web3";
import web3 from "web3";
import InfoBox from "@/app/components/InfoBox";
import ContributeForm from "@/app/components/ContributeForm";
import Link from "next/link";

function Page() {
  const { campaignId } = useParams();
  const [campaignData, setCampaignData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        // Create a contract instance with the campaign ID (address)
        const campaign = Campaign(campaignId);

        // Fetch summary data from the contract
        const summary = await campaign.methods.getSummary().call();
        console.log("Summary:", summary);
        // Organize the fetched data into a readable format
        const data = {
          minimumContribution: summary[0],
          balance: summary[1],
          requestsCount: summary[2],
          approversCount: summary[3],
          manager: summary[4],
        };

        setCampaignData(data);
      } catch (err) {
        setError("Error fetching campaign data.");
        console.error(err);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-4"
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
          <p className="text-lg text-gray-800">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Campaign Details
      </h1>
      <p className="text-gray-700 text-sm md:text-base mb-4 text-center px-4">
        Campaign ID: <span className="font-semibold">{campaignId}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        <InfoBox
          title="Minimum Contribution"
          value={`${campaignData.minimumContribution} wei`}
          description="You must contribute at least this much wei to become an approver."
        />

        <InfoBox
          title="Balance"
          value={`${web3.utils.fromWei(campaignData.balance, "ether")} ETH`}
          description="The balance is the amount of money this campaign has left to spend."
        />

        <InfoBox
          title="Requests Count"
          value={`${campaignData.requestsCount}`}
          description="A request tries to withdraw money from the contract. Requests must be approved by approvers."
        />

        <InfoBox
          title="Approvers Count"
          value={`${campaignData.approversCount}`}
          description="Number of people who have already donated to this campaign."
        />

        <InfoBox
          title="Manager Address"
          value={campaignData.manager}
          description="The manager created this campaign and can create requests to withdraw the money as needed."
        />

        <ContributeForm address={campaignId} />

        {/* "View Requests" Button */}
        <div className="w-full flex justify-center sm:col-span-2 mt-4">
          <Link href={`/campaigns/${campaignId}/requests`}>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              View Requests
            </button>
          </Link>
        </div>
        {/* Contribute Form */}
      </div>
    </div>
  );
}

export default Page;
