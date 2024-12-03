import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
        {/* Top Label */}
        <p className="text-sm sm:text-base text-blue-500 font-semibold mb-4 bg-[#0a53b966] p-[10px] rounded-full">
          Fastest ETH Bulk Sender with over 300k+ sends per week
        </p>

        {/* Main Heading */}
        <div className={`flex justify-center`}>
          <h1 className="text-3xl sm:text-5xl leading-tight mb-6 mt-[50px] w-[750px] text-center">
            Effortless Ethereum and Token Bulk Transfers
          </h1>
        </div>

        {/* Subheading */}
        <div className={`flex justify-center`}>
          <p className="text-base sm:text-lg text-[#828282] mb-8 leading-relaxed w-[750px]">
            Send Bulk Ethereum, Base Ethereum, and ERC-20 Tokens quickly,
            securely, and at scale. Perfect for airdrops, payouts, and
            large-scale distributions, all in a single transaction.
          </p>
        </div>

        {/* Call-to-Action Button */}
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          onClick={() => navigate("/bulk-sender")}
        >
          Use ETH Bulk Sender
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
