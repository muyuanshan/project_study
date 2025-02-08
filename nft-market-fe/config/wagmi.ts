import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
// console.log(process.env.WalletConnectId)


export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '94066ab3be2718981f226c7407038ba4',
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
  ],
  transports: {
    // 替换之前 不可用的 https://rpc.sepolia.org/
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/1OG1hrOTkzudc-LJx3jNkFuB-hgJmsxE')
  },
  ssr: true,
});