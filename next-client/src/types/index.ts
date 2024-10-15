export type SwapProps = {
    fromToken: { tokenName: string; address: string };
    toToken: { tokenName: string; address: string };
  };
  export type Token = {
    tokenName: string;
    address: string;
    decimals: number;
  };



export type Mint = {
  chainId: number;
  address: string;
  programId: string;
  logoURI: string;
  symbol: string;
  name: string;
  decimals: number;
  tags: string[];
  extensions: object;
}

export type PoolData = {
  type: string;
  programId: string;
  id: string;
  mintA: Mint;
  mintB: Mint;
  price: number;
  mintAmountA: number;
  mintAmountB: number;
  feeRate: number;
  openTime: string;
  tvl: number;
  day: object;
  week: object;
  month: object;
  pooltype: string[];
  rewardDefaultPoolInfos: string;
  rewardDefaultInfos: any[];
  farmUpcomingCount: number;
  farmOngoingCount: number;
  farmFinishedCount: number;
  marketId: string;
  lpMint: Mint;
  lpPrice: number;
  lpAmount: number;
  burnPercent: number;
}

export type GetPoolsInfoApiResponse = {
  id: string;
  success: boolean;
  data: PoolData[];
}