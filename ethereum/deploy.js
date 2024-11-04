// require("dotenv").config({ path: "../.env" });

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
// const { abi, bytecode } = require("./compile");
const compiledFactory = require("./build/CampaignFactory.json");
// const { describe } = require("mocha");

const provider = new HDWalletProvider(
  process.env.NEXT_PUBLIC_MNEMONIC, // Use mnemonic from .env file
  process.env.NEXT_PUBLIC_INFURA_API // Use Infura API from .env file
);

const web3 = new Web3(provider);
const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ gas: "2000000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
  } catch (error) {
    console.error("Error deploying contract:", error);
  } finally {
    provider.engine.stop();
  }
};

deploy();
