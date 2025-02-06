// 这里没有定义类型 先实现功能
export const  getGasBuffer = async (contract: any, fnName: string, args: readonly unknown[]) => {
    const estimateGas = await contract.estimateGas[fnName](args, {});
    return estimateGas * BigInt(105) / BigInt(100);
}