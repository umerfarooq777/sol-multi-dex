import React, { useState } from "react";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet hook
import { createJupiterApiClient, QuoteGetRequest, QuoteResponse } from "@jup-ag/api";
import { Wallet } from "@project-serum/anchor";
import {
  Connection,
  VersionedTransaction,
  TransactionExpiredBlockheightExceededError,
  VersionedTransactionResponse,
} from "@solana/web3.js";
import bs58 from "bs58";
import { SwapProps } from "./types";
import { Spinner } from "./Spinner";

// Import the connection to your Solana RPC endpoint
const connection = new Connection("https://solana-api.projectserum.com");

const jupiterQuoteApi = createJupiterApiClient();

const JupiterSwap: React.FC<SwapProps> = ({ fromToken, toToken }) => {
  const { publicKey, sendTransaction, signTransaction } = useWallet(); // Get connected wallet
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getJupiterQuote = async ():Promise<null|QuoteResponse> => {
    try {
      setLoading(true);
      const data:QuoteResponse = await jupiterQuoteApi.quoteGet({
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount: 1000000, // Example amount
      });
      console.log("🚀 ~ getJupiterQuote ~ data:", data)

      if (data) {
        setQuote(`Quote: ${data.outAmount} USDC`);
      } else {
        setQuote("No quote available.");
      }
      return data
    } catch (error) {
      console.error("Error fetching Jupiter quote:", error);
      setQuote("Failed to fetch quote.");
      return null
    } finally {
      setLoading(false);
    }
  };

  const executeJupiterSwap = async () => {
    if (!publicKey) {
      alert("Please connect your wallet.");
      return;
    }

    try {
      const quoteResponse = await getJupiterQuote(); // Get the quote before executing
      if(!quoteResponse) return 


      setLoading(true);


      const swapObj = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: quoteResponse,
          userPublicKey: publicKey.toBase58(),
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
        },
      });

      // Deserialize the transaction and sign with Phantom
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(swapObj.swapTransaction, "base64")
      );

      if(!transaction || !signTransaction) throw new Error("Transaction Error: ")

      const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await sendTransaction(signedTransaction, connection);
      console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
    } catch (error) {
      console.error("Error executing Jupiter swap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Jupiter Swap</h2>
      <button onClick={getJupiterQuote} disabled={loading}>
        {loading ? <Spinner /> : "Get Jupiter Quote"}
      </button>
      {quote && <p>{quote}</p>}
      <button onClick={executeJupiterSwap} disabled={loading}>
        {loading ? <Spinner /> : "Execute Swap"}
      </button>
    </div>
  );
};

export default JupiterSwap;
