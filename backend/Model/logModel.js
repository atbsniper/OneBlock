// to create a contract instance
const logContractABI = require("../Log_ABI/log.json");
const {Web3} = require("web3");
const provider = process.env.PROVIDER;

const web3 = new Web3(provider);

const logContractAddress = process.env.CNTRACTADDRESS;

const logContract = new web3.eth.Contract(
  logContractABI,
  logContractAddress
);

module.exports = logContract;