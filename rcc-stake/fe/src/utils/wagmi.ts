import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'rccStakeFE App',
  projectId: '62c1814294e67af5910fb61a226c36ac',
  chains: [
    sepolia,
  ],
  ssr: true,
});
export const defaultChainId: number = sepolia.id