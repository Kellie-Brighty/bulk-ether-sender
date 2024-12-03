import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import UseCaseSection from "../components/UseCase";
import StepsSection from "../components/StepsSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 w-full">
        <div className="flex items-center justify-between space-x-10">
          <div className="text-xl font-bold">Send It</div>
          <div className="hidden lg:flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaXTwitter size={24} className="hover:text-blue-500" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTelegram size={24} className="hover:text-blue-500" />
            </a>
          </div>
        </div>
        <div className="lg:hidden flex items-center space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaXTwitter size={24} className="hover:text-blue-500" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTelegram size={24} className="hover:text-blue-500" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <HeroSection />
        </motion.div>
        <UseCaseSection />
        <StepsSection />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500">
        &copy; 2024 Send It. All rights reserved.
      </footer>
    </div>
  );
}
