import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // For animations
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import Abi from "../common/abi";
import approveAbi from "../common/approveAbi";
import { parseEther, parseUnits } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoginButton from "../components/PrivyLoginButton";

const contractAddress = "0x2bbe6252e559ea9c4d08b7cdba116ae837d0a7ac"; // Replace with your deployed contract address

export default function BulkSenderPage() {
  const { authenticated, user } = usePrivy();
  const [_, setAuthInfo] = useState<any>({});
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const [recipients, setRecipients] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isTokenTransfer, setIsTokenTransfer] = useState<boolean>(false);
  const navigate = useNavigate();

  const [approved, setApproved] = useState(false);
  const { data: result } = useReadContract({
    abi: approveAbi,
    address: `0x${tokenAddress.slice(2)}`,
    functionName: "decimals",
  });
  const [decimalsResult, setDecimalResult] = useState(0);

  useEffect(() => {
    if (tokenAddress !== "") {
      console.log("token addresss:::", tokenAddress);
      console.log("result:::", result);
      if (result) {
        setDecimalResult(Number(result));
      }
    }
  }, [tokenAddress, result]);

  const roadmapItems = [
    { id: 1, text: "Connect Wallet", completed: true },
    { id: 3, text: "Send Bulk Ethereum and Base Ethereum", completed: true },
    { id: 4, text: "Send Bulk ERC-20 Tokens", completed: true },
    {
      id: 5,
      text: "Community Expansion and giveaways.",
      completed: false,
    },
  ];

  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  // const stringifiedTotalAmount = formatEther(totalAmount);
  // const parsedAmount = parseInt(stringifiedTotalAmount);

  const sendBulk = async () => {
    console.log("decimal resuklt:::", decimalsResult);

    try {
      if (isTokenTransfer) {
        // Step 1: Approve the contract to spend the user's tokens

        const amountArray = amounts
          .split(",")
          .map((amt) => parseUnits(amt.trim(), decimalsResult));
        const totalAmount = amountArray.reduce(
          (acc, curr) => acc + curr,
          BigInt(0)
        );
        console.log("total amount:::", totalAmount);
        writeContract({
          abi: approveAbi,
          address: `0x${tokenAddress.slice(2)}`,
          functionName: "approve",
          args: [contractAddress, totalAmount],
          // gasPrice: parseEther("0.001"),
          // gas: parseUnits("100000", 0),
        });
      } else {
        const amountArray = amounts
          .split(",")
          .map((amt) => parseEther(amt.trim()));
        const totalAmount = amountArray.reduce(
          (acc, curr) => acc + curr,
          BigInt(0)
        );
        console.log("total amount:::", totalAmount);
        // For Ether transfers
        writeContract({
          abi: Abi,
          address: contractAddress,
          functionName: "bulkSendEther",
          args: [
            recipients.split(",").map((addr) => addr.trim()), // Recipient addresses
            amounts.split(",").map((amt) => parseEther(amt.trim())), // Amounts to send in ETH
          ],
          // gasPrice: parseEther("0.00000001"),
          // gas: parseUnits("100000000", 0),
          value: totalAmount, // Total amount to send in ETH
        });
      }
    } catch (err) {
      console.error("Transaction Error:", err);
      toast.error("Transaction failed, please try again.");
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isTokenTransfer) {
      if (hash) {
        if (approved) {
          toast.info(
            `Bulk transaction Hash: ${hash}>>> ${
              isConfirming
                ? "Bulk transaction confirming, please wait..."
                : "Bulk transaction Confirmed."
            }`
          );
          if (isConfirmed) {
            toast.success("Bulk transaction Complete", {
              autoClose: false,
            });
          }
        } else {
          toast.info(
            `Approval transaction Hash: ${hash}>>> ${
              isConfirming
                ? "Approval confirming, please wait..."
                : "Approval Confirmed."
            }`
          );
          if (isConfirmed) {
            toast.success(
              "Approval Complete, initiating the bulk transaction...",
              {
                autoClose: false,
              }
            );
            setApproved(true);

            writeContract({
              abi: Abi,
              address: contractAddress,
              functionName: "bulkSendTokens",
              args: [
                tokenAddress, // Token address
                recipients.split(",").map((addr) => addr.trim()), // Recipient addresses
                amounts
                  .split(",")
                  .map((amt) => parseUnits(amt.trim(), decimalsResult)), // Amounts to send
              ],
            });
          }
        }
      }
    } else {
      if (hash) {
        toast.info(
          `Transaction Hash: ${hash}>>> ${
            isConfirming
              ? "Transaction confirming, please wait..."
              : "Transaction Confirmed."
          }`,
          { autoClose: false }
        );
      }
      if (isConfirmed) {
        toast.success("Transaction Completed!", { autoClose: false });
      }
    }
  }, [hash, isConfirming, isConfirmed]);

  // Handle authentication
  useEffect(() => {
    if (authenticated && user) {
      setAuthInfo(user);
    } else {
      setAuthInfo({});
    }
  }, [authenticated, user]);

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <header className="p-6 flex justify-between items-center bg-gray-800">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Bulk Sender
        </h1>
        <div>
          {authenticated ? (
            <div className="w-full flex justify-center">
              <LoginButton text={`${address?.substring(36, 42)}🐸`} />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <LoginButton text="Connect Wallet" />
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4">Bulk Send Form</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendBulk();
              }}
              className="space-y-4"
            >
              {/* Transfer Type */}
              <div>
                <label className="block text-gray-400">Transfer Type</label>
                <select
                  value={isTokenTransfer ? "token" : "eth"}
                  onChange={(e) =>
                    setIsTokenTransfer(e.target.value === "token")
                  }
                  className="w-full bg-gray-700 text-white p-3 rounded-lg"
                >
                  <option value="eth">Send ETH</option>
                  <option value="token">Send ERC-20 Tokens</option>
                </select>
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-gray-400">Recipients</label>
                <textarea
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder="Enter recipient addresses (comma-separated)"
                  className="w-full bg-gray-700 text-white p-3 rounded-lg"
                  rows={4}
                />
              </div>

              {/* Amounts */}
              <div>
                <label className="block text-gray-400">Amounts</label>
                <textarea
                  value={amounts}
                  onChange={(e) => setAmounts(e.target.value)}
                  placeholder="Enter amounts (comma-separated)"
                  className="w-full bg-gray-700 text-white p-3 rounded-lg"
                  rows={4}
                />
              </div>

              {/* Token Address */}
              {isTokenTransfer && (
                <div>
                  <label className="block text-gray-400">Token Address</label>
                  <input
                    type="text"
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    placeholder="Enter token address"
                    className="w-full bg-gray-700 text-white p-3 rounded-lg"
                  />
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-lg ${
                  isConfirming ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isConfirming}
              >
                {isConfirming ? "Processing..." : "Send"}
              </button>
            </form>
          </motion.div>

          {/* Roadmap Section */}
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl font-semibold mb-4">Our Roadmap</h2>
            <button
              onClick={() => setIsRoadmapOpen(!isRoadmapOpen)}
              className="w-full bg-gray-700 py-2 rounded-lg mb-4"
            >
              {isRoadmapOpen ? "Hide Roadmap" : "View Roadmap"}
            </button>
            {isRoadmapOpen && (
              <ul className="space-y-2">
                {roadmapItems.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center ${
                      item.completed ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      readOnly
                      className="form-checkbox h-5 w-5 text-green-500 mr-2"
                    />
                    {item.text}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
}
