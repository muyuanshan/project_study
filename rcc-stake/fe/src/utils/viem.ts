// 这里主要是创建一个viem的client，更加方便的与链上交互
import { sepolia } from "viem/chains";
import { PublicClient, createPublicClient, http } from "viem";

export const viemClients = (chainId: number): PublicClient => {
  const client: {
    [key: number]: PublicClient;
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(
        "https://eth-sepolia.g.alchemy.com/v2/1OG1hrOTkzudc-LJx3jNkFuB-hgJmsxE"
      ),
    }),
  };
  return client[chainId];
};
