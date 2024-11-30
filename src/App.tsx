import { usePrivy } from "@privy-io/react-auth";
import LoginButton from "./components/PrivyLoginButton";
import { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import Abi from "./common/abi"; // Import your contract's Abi
import { parseEther, parseUnits } from "viem";
import { PrimaryButton } from "./components/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const contractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"; // Replace with your deployed contract address

export default function App() {
  const { authenticated, user } = usePrivy();
  const [_, setAuthInfo] = useState<any>({});
  const { address } = useAccount();
  const {
    switchChain,
    chains,
    data: switchData,
    isPending: isSwitching,
    isSuccess: isSwitchSuccess,
  } = useSwitchChain();
  const { data: hash, writeContract, error } = useWriteContract();

  const [recipients, setRecipients] = useState<string>("");
  const [amounts, setAmounts] = useState<string>("");
  const amountArray = amounts.split(",").map((amt) => parseEther(amt.trim()));
  const totalAmount = amountArray.reduce((acc, curr) => acc + curr, BigInt(0));
  const [currentChainName, setCurrentChainName] = useState<string>("");

  const sendBulk = async () => {
    console.log("total amount:::", totalAmount);
    writeContract({
      abi: Abi,
      address: contractAddress,
      functionName: "bulkSendEther",
      args: [
        // ["0x4B2cD2688Cc3a86AfF6254C8512B2fc969008093"],
        // [parseEther("0.0001")],
        recipients.split(",").map((addr) => addr.trim()), // Recipient addresses
        amounts.split(",").map((amt) => parseEther(amt.trim())), // Amounts to send in ETH
      ],
      gasPrice: parseEther("0.001"),
      gas: parseUnits("100000", 0),
      value: totalAmount,
    });

    if (error) {
      // error.message
      // error.name
      console.log("error:", error.message);
      if (error.message.includes("Connector not connected.")) {
        alert("Please connect your wallet.");
      }
    }
  };

  useEffect(() => {
    if (isSwitchSuccess) {
      console.log("switch data, switch successful:::", switchData);
      setCurrentChainName(switchData.name);
      toast.success(`Network Switched to ${switchData.name}`, {
        autoClose: false,
      });
    }
  }, [isSwitchSuccess]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
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
      <div className={`flex justify-center items-center p-4`}>
        <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
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

          <div className="lg:flex items-center lg:space-x-[20px] space-y-[10px] lg:space-y-0">
            {chains.map((chain) => (
              <PrimaryButton
                key={chain.id}
                onClick={() => switchChain({ chainId: chain.id })}
                text={
                  currentChainName === chain.name
                    ? `${chain.name} chain is active`
                    : `Switch to ${chain.name}`
                }
                loading={isSwitching}
                active={currentChainName === chain.name}
              />
            ))}
          </div>

          {/* Form for Bulk Send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendBulk?.(); // Call the smart contract function
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
                required
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
                required
              />
            </div>

            {/* Send Button */}
            <PrimaryButton
              text={isConfirming ? "Sending..." : "Send Bulk Transactions"}
              loading={isConfirming}
              disabled={!sendBulk || isConfirming}
              type="submit"
            />
          </form>
        </div>
      </div>
      <ToastContainer />
      <footer
        className={`text-center text-[#fff] absolute bottom-[5px] lg:bottom-0 w-full`}
      >
        Send &copy; Copyright {new Date().getFullYear()}
      </footer>
    </div>
  );
}
