import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection } from '@solana/web3.js';

export const allowedPoolAddresses = [{}];

export const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;

// You can also provide a custom RPC endpoint.
export const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'localhost'
        ? 'http://localhost:8899'
        : process.env.NEXT_PUBLIC_SOLANA_CUSTOM_RPC ?? clusterApiUrl(network);

export const connection = new Connection(endpoint);