import { viemClients } from "./viem";
import { defaultChainId } from "./wagmi";
import {
  Address,
  Abi,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  getContract as viemGetContract,
} from "viem";

// 使用 viem 获取合约 参数abi，合约地址，chainId, 钱包客户端
// viemGetContract的方法获取
export const getContract = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient
>({
  abi,
  address,
  chainId = defaultChainId,
  signer,
}: {
  abi: TAbi | readonly unknown[];
  address: Address;
  chainId?: number;
  signer?: TWalletClient;
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: viemClients(chainId),
      wallet: signer,
    },
  })as unknown as GetContractReturnType<TAbi, PublicClient>;
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  };
};
