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
    .send({ from: accounts[0], gas: "2000000" });

  // Create a campaign through the factory
  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1500000" });

  // Destructuring the first element of the array
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);

  // Add console logs to verify addresses and manager
  // console.log("Deployed factory at:", factory.options.address);
  // console.log("Created campaign at:", campaignAddress);
  // console.log("Manager address:", await campaign.methods.manager().call());
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    // We don't need to create manager method in the contract because we have the public manager variable
    // Call is used to call a function that doesn't modify the contract
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  // Ganache automatically creates 10 accounts
  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "101",
      from: accounts[1],
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    // If the value is true, the test passes
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to make a payment request", async () => {
    // Console logs for debugging specific test case
    // console.log("Factory address:", factory.options.address);
    // console.log("Campaign address:", campaignAddress);
    // console.log("Manager address:", await campaign.methods.manager().call());

    await campaign.methods
      .createRequest("Buy batteries", 100, accounts[1])
      .send({
        from: accounts[0],
        gas: "3000000",
      });

    const requestsCount = await campaign.methods.getRequestsCount().call();

    // Print the length to the console
    // console.log("Length of requests array:", requestsCount);

    const request = await campaign.methods.getRequestByIndex(0).call();
    // const description = web3.utils.hexToUtf8(request[0]);
    // console.log("Request :- ", request);
    assert.equal(request.value, 100);
    assert.equal(request.recipient, accounts[1]);
    assert.equal(request.complete, false);
    assert.equal(request.approvalCount, 0);
  });
});
