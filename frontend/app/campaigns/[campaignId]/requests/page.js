"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import campaign from "./../../../../../ethereum/campaign";
import web3 from "../../../web3";
import { useState, useEffect, useMemo } from "react";

function Page() {
  const { campaignId } = useParams();
  const [requestsCount, setRequestsCount] = useState(0);
  const [campaignData, setCampaignData] = useState(null);
  const [requests, setRequests] = useState([]);

  const campaignInstance = useMemo(() => campaign(campaignId), [campaignId]);

  useEffect(() => {
    const fetchRequestsCount = async () => {
      try {
        const count = await campaignInstance.methods.getRequestsCount().call();
        setRequestsCount(parseInt(count));
      } catch (error) {
        console.error("Error fetching requests count:", error);
      }
    };
    fetchRequestsCount();
  }, [campaignInstance]);

  useEffect(() => {
    if (requestsCount > 0) {
      const fetchRequests = async () => {
        try {
          const requests = await Promise.all(
            Array(requestsCount)
              .fill()
              .map((_, index) =>
                campaignInstance.methods.requests(index).call()
              )
          );

          //   console.log("Requests:", requests[0].complete.toString());
          setRequests(requests);
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      fetchRequests();
    }
  }, [requestsCount, campaignInstance]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const approversCount = await campaignInstance.methods
          .approversCount()
          .call();
        setCampaignData({ approversCount });
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };
    fetchCampaignData();
  }, [campaignInstance]);

  const pendingRequests = requests.filter(
    (request) => !request.complete
  ).length;

  const handleApproveRequest = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.approveRequest(index).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleFinalizeRequest = async (index) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await campaignInstance.methods.finalizeRequest(index).send({
        from: accounts[0],
      });
    } catch (error) {
      console.error("Error finalizing request:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">
        Campaign Requests
      </h1>

      <div className="flex justify-center mt-4 mb-8">
        <Link href={`/campaigns/${campaignId}/requests/new`}>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200">
            Add New Request
          </button>
        </Link>
      </div>

      {/* Responsive Table Container */}
      <div className="w-full max-w-[22rem] xl:max-w-7xl md:max-w-3xl bg-white p-1 md:p-2 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-blue-100 text-blue-700 border-b-2 border-blue-200">
              <tr>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  ID
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Description
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Amount (ETH)
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Recipient
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Approval Count
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Approve
                </th>
                <th className="py-2 md:py-4 px-3 md:px-6 text-center font-semibold">
                  Finalize
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {requests.map((request, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                    request.complete ? "opacity-25" : ""
                  } ${
                    BigInt(request.approvalCount) >
                      BigInt(campaignData?.approversCount || 0) / BigInt(2) &&
                    !request.complete
                      ? "bg-green-100"
                      : ""
                  }`}
                >
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {request.description}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {web3.utils.fromWei(request.value, "ether")}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {request.recipient}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {`${request.approvalCount}/${
                      campaignData?.approversCount || 0
                    }`}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {!request.complete && (
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded-lg shadow hover:bg-green-600 transition duration-200"
                        onClick={() => handleApproveRequest(index)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                  <td className="py-2 md:py-4 px-3 md:px-6 text-center">
                    {!request.complete && (
                      <button
                        className="bg-red-500 text-white md:px-4 px-2 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200"
                        onClick={() => handleFinalizeRequest(index)}
                        disabled={request.complete}
                      >
                        Finalize
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* </div> */}
      {/* Pending Requests Summary */}
      <div className="w-full max-w-lg md:max-w-3xl text-center mt-6 md:p-4 p-2 bg-white rounded-lg shadow-md">
        <p className="text-lg font-medium text-gray-700">
          There are currently{" "}
          <span className="font-bold text-blue-700">{pendingRequests}</span>{" "}
          pending requests out of {requestsCount}.
        </p>
      </div>
    </div>
  );
}

export default Page;
