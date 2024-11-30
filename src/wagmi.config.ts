import { http, createConfig } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, metaMask, safe, walletConnect } from "wagmi/connectors";
import { projectId } from "./project.config";

export const config = createConfig({
  chains: [base, mainnet],
  connectors: [injected(), walletConnect({ projectId }), metaMask(), safe()],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
