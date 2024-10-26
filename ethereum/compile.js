const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Path to the contract
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// Prepare input for Solidity compiler
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
// const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

// for (let contract in output) {
//   fs.outputJsonSync(
//     path.resolve(buildPath, contract + ".json"),
//     output[contract]
//   );
// }

// Loop through compiled contracts and write each one to a JSON file in the build folder
for (let contractName in output.contracts["Campaign.sol"]) {
  fs.outputJsonSync(
    path.resolve(buildPath, contractName + ".json"),
    output.contracts["Campaign.sol"][contractName]
  );
}
