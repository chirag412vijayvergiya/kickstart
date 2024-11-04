"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import factory from "./../../ethereum/factory";

async function getDeployedCampaigns() {
  try {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log("Campaigns:", campaigns);
    return campaigns;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return []; // Return an empty array on error
  }
}

export default function Home() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await getDeployedCampaigns();
      setCampaigns(campaigns);
    };

    fetchCampaigns();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Open Campaign</h1>

      {/* Create Campaign Button */}
      <Link href="/campaigns/new">
        <button className="mb-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-200">
          Create Campaign
        </button>
      </Link>

      <ul className="w-full max-w-2xl bg-white shadow-lg rounded-lg overflow-hidden">
        {campaigns.length > 0 ? (
          campaigns.map((campaign, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition duration-200"
            >
              <span className="text-sm md:text-lg text-gray-700 break-all">
                <span className="text-blue-500">{index + 1}. </span> {campaign}
              </span>
              <Link href={`/campaigns/${campaign}`}>
                <button className="bg-blue-500 text-xs md:text-sm text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
                  View Details
                </button>
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center p-4 text-gray-500">
            No campaigns available
          </li>
        )}
      </ul>
    </div>
  );
}
