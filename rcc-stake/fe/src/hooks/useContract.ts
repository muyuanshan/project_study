import { useMemo } from "react";
import { Abi, Address, WalletClient } from "viem";
import { useChainId, useWalletClient } from "wagmi";
import { getContract } from "../utils/contractHelper";
import { StakeContractAddress } from "../utils/env";
import { stakeAbi } from "../assets/abis/rccStake";

type useContractOptions = {
  chainId?: number;
};

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: useContractOptions
) {
  const currentChainId = useChainId(); // 获取当前的chainId
  const chainId = options?.chainId || currentChainId;
  const { data: walletClient } = useWalletClient(); // 获取钱包的客户端

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null;
    let address: Address | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;

    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      });
    } catch (error) {
      console.log("🚀 ~ returnuseMemo ~ error:", error);
      return null;
    }
  }, [addressOrAddressMap, chainId, abi, walletClient]);
}

export const useStakeContract = () => {
  return useContract(StakeContractAddress, stakeAbi as Abi);
};
