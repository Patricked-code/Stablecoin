// pages/api/metaTransfer.js
import { ethers } from "ethers";
// import axios from "axios";
import ABI_TOKEN_EWARI from "./../../components/Contrats/Abi/AbiStablecoin.json";


const provider = new ethers.providers.JsonRpcProvider("https://rpc.testnet.moonbeam.network");

export default async function handler(req, res) {
  const { from, to, value } = req.body;
console.log("ABI_TOKEN_EWARI=>",ABI_TOKEN_EWARI.abi)
  const privateKey = "36ba8d431646b33e370eac06979af488bdddb6341bd067a676e5d33a8d72a1e1";
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0xb9dD86a5D87bB221261865da0701DA528246250b";

  const contract = new ethers.Contract(contractAddress, ABI_TOKEN_EWARI.abi, wallet);
    console.log("contract=>",contract)
  try {
    const tx = await contract.metaTransfer(from, to, value);
    const receipt = await tx.wait();
    res.status(200).json({ txHash: receipt.transactionHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la transaction" });
  }
}
