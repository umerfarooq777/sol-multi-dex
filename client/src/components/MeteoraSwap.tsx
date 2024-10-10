import React, { useState } from "react";
import axios from "axios";
import { SwapProps } from "./types";
import { Spinner } from "./Spinner"; // Assume this is your spinner component.

const MeteoraSwap: React.FC<SwapProps> = ({ fromToken, toToken }) => {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getMeteoraQuote = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.meteora.io/v1/swap/quote",
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
      console.error("Error fetching Meteora quote:", error);
      //   setQuote('Failed to fetch quote.');
    } finally {
      setLoading(false);
    }
  };

  const executeMeteoraSwap = async () => {
    try {
      setLoading(true);
      // Placeholder logic. Use Meteora's API when available for executing the swap.
      console.log("Executing Meteora swap...");
    } catch (error) {
      console.error("Error executing Meteora swap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Meteora Swap</h2>
      <button onClick={getMeteoraQuote} disabled={loading}>
        {loading ? <Spinner /> : "Get Meteora Quote"}
      </button>
      {quote && <p>{quote}</p>}
      <button onClick={executeMeteoraSwap} disabled={loading}>
        {loading ? <Spinner /> : "Execute Swap"}
      </button>
    </div>
  );
};

export default MeteoraSwap;
