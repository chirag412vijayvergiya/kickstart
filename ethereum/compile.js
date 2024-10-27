const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Path to the contract
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// // Prepare input for Solidity compiler
// const input = {
//   language: "Solidity",
//   sources: {
//     "Campaign.sol": {
//       content: source,
//     },
//   },
//   settings: {
//     outputSelection: {
//       "*": {
//         "*": ["abi", "evm.bytecode.object"],
//       },
//     },
//   },
// };

// const input = {
//   language: "Solidity",
//   sources: {
//     "Campaign.sol": {
//       content: source,
//     },
//   },
//   settings: {
//     optimizer: {
//       enabled: true,
//       runs: 1000, // Increase this value to optimize for more contract interaction efficiency
//     },
//     outputSelection: {
//       "*": {
//         "*": ["abi", "evm.bytecode.object"],
//       },
//     },
//   },
// };

// Compile the contract source code
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
        "*": ["*"], // Adjust based on what you want to output (e.g., ABI, bytecode)
      },
    },
  },
};

// const output = JSON.parse(solc.compile(JSON.stringify(input)));
// // const output = solc.compile(source, 1).contracts;

// fs.ensureDirSync(buildPath);

// // for (let contract in output) {
// //   fs.outputJsonSync(
// //     path.resolve(buildPath, contract + ".json"),
// //     output[contract]
// //   );
// // }

// console.log(output);

// // Loop through compiled contracts and write each one to a JSON file in the build folder
// for (let contractName in output.contracts["Campaign.sol"]) {
//   // outputJsonSync writes the JSON file to the specified path
//   fs.outputJsonSync(
//     path.resolve(buildPath, contractName + ".json"),
//     output.contracts["Campaign.sol"][contractName]
//   );
// }

// // Compile the contract and parse the output
// try {
//   const output = JSON.parse(solc.compile(JSON.stringify(input)));

//   // Ensure the build directory exists
//   fs.ensureDirSync(buildPath);

//   // Loop through compiled contracts and write each one to a JSON file in the build folder
//   for (let contractName in output.contracts["Campaign.sol"]) {
//     fs.outputJsonSync(
//       path.resolve(buildPath, contractName + ".json"),
//       output.contracts["Campaign.sol"][contractName]
//     );
//   }

//   console.log("Contracts compiled and output written to build directory.");
// } catch (error) {
//   console.error("Compilation error:", error);
// }

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

// Create the build directory
fs.ensureDirSync(buildPath);

// Write the output to the build directory
for (const contractName in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, `${contractName}.json`),
    output[contractName]
  );
}

console.log("Contracts compiled and outputted to the build directory.");
