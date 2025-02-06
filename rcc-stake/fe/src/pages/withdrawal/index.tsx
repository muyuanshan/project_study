import { LoadingButton } from "@mui/lab";
import { Box, Typography, Grid, TextField } from "@mui/material";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useMemo, useEffect } from "react";
import { useWalletClient } from "wagmi";
import { useStakeContract } from "../../hooks/useContract";
import { Pid } from "../../utils";
import { formatUnits, parseUnits } from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { toast } from "react-toastify";
import { getGasBuffer } from "../../utils/utils";

// 定义用户的stake数据类型
export type UserStakeData = {
  staked: string;
  withdrawable: string;
  withdrawPending: string;
};

// 初始化用户的stake数据
const initData: UserStakeData = {
  staked: "0",
  withdrawable: "0",
  withdrawPending: "0",
};

const page: NextPage = () => {
  // 从wagmi中获取到当前的账户信息
  const { isConnected, address } = useAccount();

  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [amount, setAmount] = useState("0");

  const [userData, setUserData] = useState<UserStakeData>(initData);
  const stakeContract = useStakeContract();
  const { data } = useWalletClient();

  // 判断用户是否有可提取的资金
  const isWithdrawable = useMemo(() => {
    return Number(userData.withdrawable) > 0 && isConnected;
  }, [userData, isConnected]);

  // 从合约中获取用户的数据--合约交互
  const getUserData = async () => {
    if (!stakeContract || !address) return;
    try {
      // 获取质押的数量
      const staked = await stakeContract?.read.stakingBalance([Pid, address]);

      // 获取提款的额度
      const [requestAmount, pendingWithdrawAmount] =
        (await stakeContract?.read.withdrawAmount([Pid, address])) as [
          bigint,
          bigint
        ];
      const ava = Number(formatUnits(pendingWithdrawAmount as bigint, 18));
      const p = Number(formatUnits(requestAmount as bigint, 18));

      setUserData({
        staked: formatUnits(staked as bigint, 18),
        withdrawPending: (p - ava).toFixed(4),
        withdrawable: ava.toString(),
      });
    } catch (error) {
      console.log("🚀 ~ getUserData ~ error:", error);
    }
  };

  const handleUnStake = async () => {
    if (!stakeContract || !data) return;
    try {
      setUnstakeLoading(true);
      // console.log("🚀 ~ handleUnStake ~ estimateGas:", estimateGas);
      const gasBuffer = await getGasBuffer(stakeContract, "unstake", [Pid, parseUnits(amount, 18)]);
      // 构造交易
      const tx = await stakeContract.write.unstake([
        Pid,
        parseUnits(amount, 18),
      ], {
        gasLimit: gasBuffer,
      });
      const res = await waitForTransactionReceipt(data, {hash: tx}); // 等待交易完成
      console.log("🚀 ~ handleUnStake ~ 交易回执:", res);
      toast.success("Unstake success");
      setUnstakeLoading(false);
    } catch (error) {
      console.log("🚀 ~ handleUnStake ~ error:", error);
      setUnstakeLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!stakeContract || !data) return;
    try {
      setWithdrawLoading(true);
      const gasBuffer = await getGasBuffer(stakeContract, "withdraw",[Pid]);
      // 构造交易
      const tx = await stakeContract.write.withdraw([Pid], {
        gasLimit: gasBuffer,
      });
      const res = await waitForTransactionReceipt(data, { hash: tx }); // 等待交易完成
      console.log("🚀 ~ handleWithdraw ~ res:", res);
      toast.success("Withdraw success");
      setWithdrawLoading(false);      
    } catch (error) {
      console.log("🚀 ~ handleWithdraw ~ error:", error);
      setWithdrawLoading(true);
    }
  };

  useEffect(() => {
    if (stakeContract && address) {
      getUserData();
    }
  }, [stakeContract, address]);

  return (
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
        <Grid
          container
          sx={{
            mb: "60px",
            "& .title": {
              fontSize: "15px",
              mb: "5px",
            },
            "& .val": {
              fontSize: "18px",
              fontWeight: "bold",
            },
          }}
        >
          <Grid item xs={4}>
            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Box className="title">Staked Amount: </Box>
              <Box className="val">{userData.staked} ETH</Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Box className="title">Available to withdraw </Box>
              <Box className="val">{userData.withdrawable} ETH</Box>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Box className="title">Pending Withdraw: </Box>
              <Box className="val">{userData.withdrawPending} ETH</Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ fontSize: "20px", mb: "10px" }}>Unstake</Box>
        <TextField
          onChange={(e) => {
            setAmount(e.target.value || "0");
          }}
          sx={{ minWidth: "300px" }}
          label="Amount"
          variant="outlined"
        />
        <Box mt="20px">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <LoadingButton
              variant="contained"
              loading={unstakeLoading}
              onClick={handleUnStake}
            >
              UnStake
            </LoadingButton>
          )}
        </Box>
        <Box sx={{ fontSize: "20px", mb: "10px", mt: "40px" }}>Withdraw</Box>
        <Box> Ready Amount: {userData.withdrawable}</Box>
        <Typography fontSize={"14px"} color={"#888"}>
          After unstaking, you need to wait 20 minutes to withdraw.
        </Typography>
        <LoadingButton
          sx={{ mt: "20px" }}
          disabled={!isWithdrawable}
          variant="contained"
          loading={withdrawLoading}
          onClick={handleWithdraw}
        >
          Withdraw
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default page;
