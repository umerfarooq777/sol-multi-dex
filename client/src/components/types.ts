export type SwapProps = {
    fromToken: { tokenName: string; address: string };
    toToken: { tokenName: string; address: string };
  };
  export type Token = {
    tokenName: string;
    address: string;
    decimals: number;
  };