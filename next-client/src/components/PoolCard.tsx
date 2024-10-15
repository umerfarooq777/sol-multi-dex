// PoolCard.tsx
import React from 'react';
import { Mint, PoolData } from '../types';
import { useWallet } from '@solana/wallet-adapter-react'; // Import wallet hook
import { createJupiterApiClient, QuoteResponse } from '@jup-ag/api';
import { VersionedTransaction } from '@solana/web3.js';
import { connection } from '../constants';

const jupiterQuoteApi = createJupiterApiClient();

interface PoolCardProps {
    pool: PoolData;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool }) => {
    const { publicKey, sendTransaction, signTransaction } = useWallet(); // Get connected wallet
    const [quote, setQuote] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);

    const getJupiterQuote = async (fromToken: Mint, toTokenAddress: string): Promise<QuoteResponse | null> => {
        try {
            setLoading(true);
            const data: QuoteResponse = await jupiterQuoteApi.quoteGet({
                inputMint: fromToken.address,
                outputMint: toTokenAddress,
                amount: 1 * fromToken.decimals, // Example amount
            });

            if (data) {
                setQuote(`Quote: ${parseFloat(data.outAmount)}`);
            } else {
                setQuote('No quote available.');
            }
            return data;
        } catch (error) {
            console.error('Error fetching Jupiter quote:', error);
            setQuote('Failed to fetch quote.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const executeJupiterSwap = async () => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }

        try {
            const fromTokenAddress = pool.mintA; // Example from token
            const toTokenAddress = pool.mintB.address; // Example to token
            const quoteResponse = await getJupiterQuote(fromTokenAddress, toTokenAddress);
            if (!quoteResponse) return;

            setLoading(true);
            const swapObj = await jupiterQuoteApi.swapPost({
                swapRequest: {
                    quoteResponse: quoteResponse,
                    userPublicKey: publicKey.toBase58(),
                    dynamicComputeUnitLimit: true,
                    prioritizationFeeLamports: 'auto',
                },
            });

            // Deserialize the transaction and sign with the wallet
            const transaction = VersionedTransaction.deserialize(Buffer.from(swapObj.swapTransaction, 'base64'));

            if (!transaction || !signTransaction) throw new Error('Transaction Error: ');

            const signedTransaction = await signTransaction(transaction);
            const signature = await sendTransaction(signedTransaction, connection);
            console.log(`Transaction sent: https://solscan.io/tx/${signature}`);
        } catch (error) {
            console.error('Error executing Jupiter swap:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pool-card" style={{display:"flex"}}>
            
            <div>            <h3>
                {pool.mintA.symbol} / {pool.mintB.symbol}
            </h3>
            <p>Price: {pool.price}</p>
            <p>TVL: {pool.tvl}</p>
            <button onClick={() => getJupiterQuote(pool.mintA, pool.mintB.address)} disabled={loading}>
                {loading ? 'Loading...' : `Get 1 ${pool.mintA.symbol} Qoute`}
            </button>
            <button onClick={executeJupiterSwap} disabled={loading}>
                {loading ? 'Loading...' : 'Swap'}
            </button>
            {quote && <p>{quote}</p>}</div>


            <div>
                <iframe
                    id={pool.id}
                    title={`${pool.mintA.symbol} / ${pool.mintB.symbol}`}
                    width="800"
                    height="300"
                    src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${pool.id}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false`}
                ></iframe>
            </div>
        </div>
    );
};

export default PoolCard;

//   const publicAddress = publicKey?.toBase58()
//   if (!publicAddress || !connection) {
//     alert("Please connect your wallet.");
//     return;
//   }
//   setLoading(true);

//   const quoteResponse = await getJupiterQuote(); // Get the quote before executing
//   if (!quoteResponse) return;

//   const hash = await connection?.getLatestBlockhash();
//   if (!hash) return;

//   try {
//     const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
//       swapRequest: {
//         quoteResponse: quoteResponse,
//         userPublicKey: publicAddress,
//         dynamicComputeUnitLimit: true,
//         prioritizationFeeLamports: "auto",
//       },
//     });
//     console.log("🚀 ~ executeJupiterSwapMagicLink ~ swapObj:", swapObj);

//     // Convert the base64-encoded transaction to Uint8Array
//     const encodedTx = swapObj.swapTransaction;
//     const decodedTx = Uint8Array.from(Buffer.from(encodedTx, "base64"));

//     // Deserializing the versioned transaction using VersionedMessage
//     const message = VersionedMessage.deserialize(decodedTx);
//     const transaction = new VersionedTransaction(message);

//     console.log("🚀 ~ executeJupiterSwapMagicLink ~ Versioned Transaction:", transaction);

//     // Sign the transaction with Magic or your connected wallet
//     const signedTransaction = await magic?.solana.signTransaction(transaction, {
//       requireAllSignatures: false,
//       verifySignatures: true,
//     });

//     // Send the signed transaction
//     const signature = await connection.sendRawTransaction(
//       signedTransaction.serialize()
//     );

//     // Confirm transaction
//     await connection.confirmTransaction(signature, "processed");

//     console.log("Transaction sent with signature:", signature);

//   } catch (error) {
//     console.error("Error executing Jupiter swap:", error);
//   } finally {
//     setLoading(false);
//   }
// };
