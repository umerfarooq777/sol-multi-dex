import React, { useState } from "react";
import axios from "axios";
import { SwapProps } from "./types";
import { Spinner } from "./Spinner"; // Assume this is your spinner component.

const RaydiumSwap: React.FC<SwapProps> = ({ fromToken, toToken }) => {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getRaydiumQuote = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.raydium.io/v1/swap/quote",
        {
          fromToken: fromToken.tokenName,
          toToken: toToken.tokenName,
          amount: 1,
        }
      );

      if (response.data) {
        setQuote(`Quote: ${response.data.amountOut} USDC`);
      }
      //   else {
      //     setQuote('No quote available.');
      //   }
    } catch (error) {
      console.error("Error fetching Raydium quote:", error);
      //   setQuote('Failed to fetch quote.');
    } finally {
      setLoading(false);
    }
  };

  const executeRaydiumSwap = async () => {
    try {
      setLoading(true);
      // Placeholder logic. You will need to implement Raydium swap execution with Solana SDK here.
      console.log("Executing Raydium swap...");
    } catch (error) {
      console.error("Error executing Raydium swap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Raydium Swap</h2>
      <button onClick={getRaydiumQuote} disabled={loading}>
        {loading ? <Spinner /> : "Get Raydium Quote"}
      </button>
      {quote && <p>{quote}</p>}
      <button onClick={executeRaydiumSwap} disabled={loading}>
        {loading ? <Spinner /> : "Execute Swap"}
      </button>
    </div>
  );
};

export default RaydiumSwap;
