import {
  FaParachuteBox,
  FaMobileAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
} from "react-icons/fa";

const UseCaseSection = () => {
  const useCases = [
    {
      id: 1,
      icon: <FaParachuteBox className="text-blue-500 text-5xl" />,
      title: "A scalable, reliable platform",
      description:
        "Effortlessly distribute tokens to thousands of community members in seconds.",
    },
    {
      id: 2,
      icon: <FaMobileAlt className="text-blue-500 text-5xl" />,
      title: "A scalable, reliable platform",
      description:
        "Effortlessly distribute tokens to thousands of community members in seconds.",
    },
    {
      id: 3,
      icon: <FaMoneyBillWave className="text-blue-500 text-5xl" />,
      title: "A scalable, reliable platform",
      description:
        "Effortlessly distribute tokens to thousands of community members in seconds.",
    },
    {
      id: 4,
      icon: <FaExchangeAlt className="text-blue-500 text-5xl" />,
      title: "A scalable, reliable platform",
      description:
        "Effortlessly distribute tokens to thousands of community members in seconds.",
    },
  ];

  return (
    <section className="bg-black text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
        {/* Section Title */}
        <p className="text-sm sm:text-base text-blue-500 font-semibold mb-4">
          Use Cases
        </p>
        <h2 className="text-2xl sm:text-4xl font-bold mb-8">
          Efficient Solutions for Every Transfer Need
        </h2>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="flex flex-col items-center text-center space-y-4"
            >
              {/* Icon */}
              <div>{useCase.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-medium">{useCase.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-300">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
