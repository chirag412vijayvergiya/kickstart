// require("dotenv").config({ path: "../.env" });

import web3 from "../frontend/app/web3";
import CampaignFactory from "./build/CampaignFactory.json";

const address = process.env.NEXT_PUBLIC_NEW_DEPLOYED_ADDRESS;

// console.log("Deployed address:", address);

const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;
