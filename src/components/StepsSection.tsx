import { FaUpload, FaMoneyCheckAlt, FaPaperPlane } from "react-icons/fa";

const StepsSection = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUpload className="text-white text-4xl" />,
      title: "Upload Recipient List",
      description: "Input addresses manually or upload a CSV file.",
    },
    {
      id: 2,
      icon: <FaMoneyCheckAlt className="text-white text-4xl" />,
      title: "Specify Amounts",
      description: "Set the amount for each recipient or distribute evenly.",
    },
    {
      id: 3,
      icon: <FaPaperPlane className="text-white text-4xl" />,
      title: "Confirm & Send",
      description:
        "Review details, pay the gas fee, and watch your transactions process instantly.",
    },
  ];

  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Send ETH & Tokens in 3 Easy Steps
        </h2>
        <p className="text-sm sm:text-base text-white/80 mb-8">
          Send Ethereum and tokens in bulk with ease. Just upload, customize,
          and confirm.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center space-y-4 border border-dashed border-white/50 p-6 rounded-lg"
            >
              {/* Icon */}
              <div>{step.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-medium">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-white/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
