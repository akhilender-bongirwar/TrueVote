import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal, useWeb3ModalTheme } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useEffect, useState } from "react";
import getWeb3 from "../getWeb3";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

const projectId = "185080f4e1724e7b7456747dda526c5f";
const chains = [sepolia];
const { provider } = configureChains(chains, [async () => await getWeb3()]);

const Wagmiconfig = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => setIsReady(true), []);

  const wagmiClient = createClient({
    autoConnect: isReady,
    connectors: [
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
        },
      }),
    ],
    provider,
  });

  const ethereumClient = new EthereumClient(wagmiClient, chains);
  const { theme, setTheme } = useWeb3ModalTheme();
  setTheme({
    themeMode: "light",
    themeColor: "purple",
    themeBackground: "gradient",
  });
  return (
    <div>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        className="default-layout-web3modal"
      />
    </div>
  );
};

export default Wagmiconfig;
