// 部署质押合约

const { ethers, upgrades } = require("hardhat");

async function main() {
  // 质押合约用的代币地址 这里用的是自己部署的测试代币 Brook
  const BrookTokenAddress = '0xD195BC7E6c6daA9886aC0be4B4f09324c76CEeF5';
  // 这里用的是部署测试网 进行模拟
  const provider = ethers.getDefaultProvider("sepolia");
  // 为什么要有start 和 end呢？ 用来计算这个合约的执行事件，也就是说是质押的总时间
  // 每个区块奖励的Rcc token的数量
  const startBlock = await provider.getBlockNumber();
  // 质押结束的区块高度,sepolia 出块时间是12s,想要质押合约运行x秒,那么endBlock = startBlock+x/12
  const endBlock = startBlock + 2592000 /12;

  // 每个区块奖励的Rcc token的数量
  const RccPerBlock = "20000000000000000";

  const stakeContract = hre.ethers.getContractFactory("BrookStake");
  //deployProxy 参数说明
  // 具体升级的合约，这个合约初始化的参数，初始化函数
  // 通过代理合约 来进行升级
  const s = await upgrades.deployProxy(
    stakeContract,
    [RccToken, startBlock, endBlock, RccPerBlock],
    { initializer: "initialize" }
  );

}
main();
