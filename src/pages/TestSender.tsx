import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import LoginButton from "../components/PrivyLoginButton";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from "wagmi";
import Abi from "../common/abi"; // Import your contract's Abi
import approveAbi from "../common/approveAbi"; // Import your contract's Abi
import { parseEther, parseUnits } from "viem";
import { PrimaryButton } from "../components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const contractAddress = "0x2bbe6252e559ea9c4d08b7cdba116ae837d0a7ac";

const TestSender = () => {
  const { authenticated, user } = usePrivy();
  const [_, setAuthInfo] = useState<any>({});
  const { address } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const [recipients, setRecipients] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isTokenTransfer, setIsTokenTransfer] = useState<boolean>(false);

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
          gasPrice: parseEther("0.001"),
          gas: parseUnits("100000", 0),
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
    <div className="min-h-screen bg-gray-900 ">
      <header className={`flex items-center justify-between p-[20px]`}>
        <div className={`lg:flex items-center lg:space-x-[20px]`}>
          <p className={`text-[#fff]`}>Send Logo</p>
          <div className={`hidden lg:flex space-x-[20px]`}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaXTwitter color="#fff" size={30} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTelegramPlane color="#fff" size={30} />
            </a>
          </div>
        </div>
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

      <div className="flex flex-col lg:flex-row lg:justify-center items-center p-4 space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Form Section */}

        <div className="w-full lg:w-[600px] lg:h-[500px] overflow-y-scroll bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
          <div className={`flex lg:hidden space-x-[20px] justify-center`}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaXTwitter color="#fff" size={30} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTelegramPlane color="#fff" size={30} />
            </a>
          </div>
          <h1 className="text-2xl text-white font-semibold text-center">
            ETH Bulk Sender
          </h1>

          {/* Toggle between ETH and Token Transfer */}
          <div className="w-full">
            <div>
              <label className="text-gray-400 mb-[10px]">Transfer Type</label>
              <select
                value={isTokenTransfer ? "token" : "eth"}
                onChange={(e) => setIsTokenTransfer(e.target.value === "token")}
                className="w-full bg-gray-700 text-white p-3 rounded-lg"
              >
                <option value="eth">Send ETH</option>
                <option value="token">Send ERC-20 Tokens</option>
              </select>
            </div>
          </div>

          {/* Form for Bulk Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendBulk(); // Call the smart contract function
            }}
            className="space-y-4"
          >
            {/* Recipients */}
            <div>
              <label className="block text-gray-400 mb-1">Recipients</label>
              <textarea
                value={recipients}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setRecipients(e.target.value)
                }
                placeholder="Enter recipient addresses (comma-separated)"
                className="w-full bg-gray-700 text-white p-3 rounded-lg placeholder-gray-500 resize-none"
                rows={4}
                // required
              />
            </div>

            {/* Amounts */}
            <div>
              <label className="block text-gray-400 mb-1">Amounts</label>
              <textarea
                value={amounts}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAmounts(e.target.value)
                }
                placeholder="Enter amounts in ETH (comma-separated)"
                className="w-full bg-gray-700 text-white p-3 rounded-lg placeholder-gray-500 resize-none"
                rows={4}
                // required
              />
            </div>

            {/* Token Address (for ERC-20 transfers) */}
            {isTokenTransfer && (
              <div>
                <label className="block text-gray-400 mb-1">
                  Token Address
                </label>
                <input
                  type="text"
                  value={tokenAddress}
                  onChange={(e) => setTokenAddress(e.target.value)}
                  placeholder="Enter token address"
                  className="w-full bg-gray-700 text-white p-3 rounded-lg placeholder-gray-500"
                  // required
                />
              </div>
            )}

            <PrimaryButton text="Send" loading={isConfirming} />
          </form>
        </div>

        {/* Roadmap Section */}
        <div className="w-full lg:w-[600px] lg:h-[500px] bg-gray-800 rounded-lg shadow-lg p-6 space-y-4 order-1 lg:order-2">
          <h2 className="text-xl text-white font-semibold">
            Our Progressive Checklist
          </h2>
          {/* Mobile Dropdown Button */}
          <button
            onClick={() => setIsRoadmapOpen(!isRoadmapOpen)}
            className="flex lg:hidden items-center justify-between w-full bg-gray-700 text-white p-3 rounded-lg"
          >
            <span>{isRoadmapOpen ? "Hide Roadmap" : "View Roadmap"}</span>
            {isRoadmapOpen ? (
              <FaChevronUp className="ml-2" />
            ) : (
              <FaChevronDown className="ml-2" />
            )}
          </button>
          {/* Roadmap List - Hidden on mobile unless dropdown is open */}
          <div
            className={`lg:block ${
              isRoadmapOpen ? "block" : "hidden"
            } lg:space-y-2`}
          >
            <ul className="space-y-2">
              {roadmapItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center space-x-2 text-gray-400"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="form-checkbox h-5 w-5 text-green-500"
                  />
                  <span
                    className={`${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default TestSender;
