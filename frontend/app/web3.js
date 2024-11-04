import Web3 from "web3";

let web3;

// console.log("Web3 provider:", process.env.NEXT_PUBLIC_INFURA_API); // Debugging log to verify the URL

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  // console.log("Metamask is running");
  window.ethereum.request({ method: "eth_requestAccounts" });
  // console.log("Metamask accounts:", window.ethereum);
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask.
  // console.log("Metamask is not running");
  const providerUrl = process.env.NEXT_PUBLIC_INFURA_API;
  // // console.log("Infura API URL:", providerUrl); // Debugging log to verify the URL

  if (!providerUrl) {
    throw new Error("INFURA_API environment variable is not defined");
  }

  const provider = new Web3.providers.HttpProvider(providerUrl);
  // console.log(provider);
  web3 = new Web3(provider);
}

export default web3;
