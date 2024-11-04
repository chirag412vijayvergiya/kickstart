require("dotenv").config({ path: "../.env" });

import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";
const address = process.env.NEW_DEPLOYED_ADDRESS;

const instance = new web3.eth.Contract(CampaignFactory.abi, address);

export default instance;