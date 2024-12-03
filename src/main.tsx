import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";
import { PRIVY_APP_ID } from "./config";
import { WagmiProvider } from "wagmi";
import { config } from "./wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const contractAddress = "0xdad40eee17e8733eef4d2f888282ce20858de766";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Display email and wallet as login methods
        loginMethods: [
          // "email",
          "wallet",
          // "twitter",
          // "google",
          // "farcaster",
          // "github",
          // "discord",
        ],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://your-logo-url",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  </React.StrictMode>
);
