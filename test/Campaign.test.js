const ganache = require("ganache");
const { Web3 } = require("web3");
const assert = require("assert");

const web3 = new Web3(ganache.provider());

// When we are importing the JSON files, we are importing the ABI and the bytecode of the contract
// It automatically parses the JSON file and gives us the object
// No need to use JSON.parse
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");
const { beforeEach } = require("mocha");

let factory;
let accounts;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // Deploy the factory contract
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });

  // Create a campaign through the factory
  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  // Destructuring the first element of the array
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
});
