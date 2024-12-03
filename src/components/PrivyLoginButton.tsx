import { usePrivy } from "@privy-io/react-auth";
import { useDisconnect } from "wagmi"; // Import the useDisconnect hook

interface PrivyAuthButtonProps {
  text: string;
}

export default function LoginButton({ text }: PrivyAuthButtonProps) {
  const { ready, authenticated, login, logout } = usePrivy();
  const { disconnect } = useDisconnect(); // Initialize the disconnect function

  const handleLogout = () => {
    logout(); // Logs out from Privy
    disconnect(); // Disconnects the wallet
  };

  return (
    <button
      className={`bg-[#1b60e9] text-white p-[10px] w-full rounded-[8px] font-[700] ${
        !ready && `bg-[#ccc] cursor-not-allowed`
      }`}
      disabled={!ready}
      onClick={authenticated ? handleLogout : login}
      style={{ minWidth: "200px" }} // Added minWidth for better mobile display
    >
      {text}
    </button>
  );
}
