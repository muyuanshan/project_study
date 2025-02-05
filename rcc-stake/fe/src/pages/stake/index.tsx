import { Box, Typography, TextField } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useStakeContract } from "../../hooks/useContract";
import { formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";
import { Pid } from "../../utils";

const page = () => {
  const [amount, setAmount] = useState("0");
  const [stakedAmount, setStakeAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

  const stakeContract = useStakeContract(); // 获取到链上的合约
  // console.log("🚀 ~ page ~ stakeContract:", stakeContract)
  const { data } = useWalletClient(); // 获取到钱包的数据
  // console.log("🚀 ~ page ~ data:", data); 

  const getStakedAmount = useCallback(async () => {
    if (stakeContract && address) {
      const res = await stakeContract?.read.poolLength();
      console.log("🚀 ~ getStakedAmount ~ res:", res)
      
      // const res = await stakeContract?.read.stakingBalance(['0', address])
      // console.log("🚀 ~ getStakedAmount ~ res:", res);
      // setStakeAmount(formatUnits(res as bigint, 18));
    }

  }, [stakeContract, address])

  const handleStake = async () => {
    if (!stakeContract || !data) return;
    try {
      setLoading(true);
      const tx = await stakeContract.write.depositETH([], { vlaue: parseUnits(amount, 18) }); // 构造交易
      const res = await waitForTransactionReceipt(data, { hash: tx }); // 等待交易完成
      console.log("🚀 ~ handleStake ~ res:", res);
      toast.success("Transaction receipt !");
      setLoading(false);
      getStakedAmount();
    } catch (error) {
      console.log("🚀 ~ handleStake ~ error:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (stakeContract && address) {
      getStakedAmount();
    }
  }, [stakeContract, address])


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
          <TextField onChange={(e) => {
            setAmount(e.target.value || '0')
          }} sx={{ minWidth: '300px' }} label="Amount" variant="outlined"></TextField>
          <Box mt="30px">
            {
              isConnected ?
                <LoadingButton loading={loading} variant="contained" onClick={handleStake}>stake</LoadingButton> :
                <ConnectButton />
            }
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default page;
