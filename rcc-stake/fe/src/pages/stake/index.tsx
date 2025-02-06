import { Box, Button, Typography, TextField } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useStakeContract } from "../../hooks/useContract";
import { formatUnits, parseUnits, zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";
import { Pid } from "../../utils";
import {viemClients} from "../../utils/viem";

const page = () => {
  const [amount, setAmount] = useState("0");
  const [stakedAmount, setStakeAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const stakeContract = useStakeContract(); // 获取到链上的合约
  const { data } = useWalletClient(); // 获取到钱包的数据
  // console.log("🚀 ~ page ~ data:", data);

  const updatePool = async () => {
    try {
      if (stakeContract) {
        const res = await stakeContract.write.addPool([
          zeroAddress,
          "100",
          parseUnits("0.001", 18),
          "10",
          true,
        ]);
        console.log("🚀 ~ updatePool ~ res:", res);
      }
    } catch (error) {
      console.log("🚀 ~ updatePool ~ error:", error);
    }
  };

  const getStakedAmount = useCallback(async () => {
    if (stakeContract && address) {
      const res = await stakeContract?.read.stakingBalance(['0', address])
      // console.log("🚀 ~ getStakedAmount ~ res:", res);
      setStakeAmount(formatUnits(res as bigint, 18));
    }
  }, [stakeContract, address]);

  const handleStake = async () => {
    if (!stakeContract || !data) return;
    try {
      setLoading(true);
      const chainId = await data.getChainId();
      const v = viemClients(chainId);
      const gasPrice = await v.getGasPrice(); // 获取当前链上的gasPrice
      
      // 先预估一下费用 看看有没有问题，用的预估的费用，也算一个gas优化
      const estimateGas = await stakeContract.estimateGas.depositETH([], {
        value: parseUnits(amount, 18),
      }); 
      const gasBuffer = estimateGas * BigInt(105) / BigInt(100); // 增加 5% buffer

      // 构造交易
      const tx = await stakeContract.write.depositETH([], {
        value: parseUnits(amount, 18),
        gasLimit: gasBuffer,
        maxFeePerGas: gasPrice * BigInt(12) / BigInt(10), // 1.2倍的gasPrice  预留的buffer
      }); 
      const res = await waitForTransactionReceipt(data, { hash: tx }); // 等待交易完成
      console.log("🚀 ~ handleStake ~ res:", res);
      toast.success("Transaction receipt !");
      setLoading(false);
      getStakedAmount();
    } catch (error) {
      console.log("🚀 ~ handleStake ~ error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stakeContract && address) {
      getStakedAmount();
    }
  }, [stakeContract, address]);

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
          RCC Stake
        </Typography>
        <Typography>Stake ETH to earn tokens.</Typography>
        <Box
          sx={{
            border: "1px solid #eee",
            borderRadius: "12px",
            p: "20px",
            width: "600px",
            mt: "30px",
          }}
        >
          <Box display="flex" alignItems="center" gap="5px" mb="10px">
            <Box>Staked Amount: </Box>
            <Box>{stakedAmount} ETH</Box>
          </Box>
          {/** 这个按钮是部署合约之后 初始化pool用的 */}
          {/* <Button onClick={updatePool}>Update</Button> */}
          <TextField
            onChange={(e) => {
              setAmount(e.target.value || "0");
            }}
            sx={{ minWidth: "300px" }}
            label="Amount"
            variant="outlined"
          ></TextField>
          <Box mt="30px">
            {isConnected ? (
              <LoadingButton
                loading={loading}
                variant="contained"
                onClick={handleStake}
              >
                stake
              </LoadingButton>
            ) : (
              <ConnectButton />
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default page;
