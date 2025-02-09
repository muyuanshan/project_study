"use client";

import { useAccount, useDisconnect } from "wagmi";
import { useState } from "react";
import { formatAddress } from "@/lib/utils";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Wallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  return (
    <div className="flex items-center gap-2">
      {isConnected && address ? (
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">{formatAddress(address)}</div>
          <button
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
            onClick={() => disconnect()}
          >
            断开连接
          </button>
        </div>
      ) : (
        <button
          onClick={openConnectModal}
          className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          连接钱包
        </button>
      )}
    </div>
  );
};

export default Wallet;
