import React, { useState, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import RaydiumSwap from './components/RaydiumSwap';
import JupiterSwap from './components/JupiterSwap';
import MeteoraSwap from './components/MeteoraSwap';
import { Token } from './components/types';

// Import styles for wallet adapters
import '@solana/wallet-adapter-react-ui/styles.css';
import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = process;

const App: React.FC = () => {
  const TOKENS: Token[] = [
    {
      tokenName: 'SOL',
      // address: 'So11111111111111111111111111111111111111112',
      // address: 'SuperbZyz7TsSdSoFAZ6RYHfAWe9NmjXBLVQpS8hqdx',
      address: 'UXPhBoR3qG4UCiGNJfV7MqhHyFqKN68g45GoYvAeL2M',
      decimals: 9,
    },
    {
      tokenName: 'USDC',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
    },
  ];

  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[1]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = TOKENS.find((token) => token.tokenName === e.target.value);
    if (selected) {
      setFromToken(selected);
      setToToken(TOKENS.find((token) => token.tokenName !== selected.tokenName)!);
    }
  };

  // Set up the network and wallets
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
            <h1>Swap Tokens</h1>
            <WalletMultiButton />
            <div>
              <label>From: </label>
              <select value={fromToken.tokenName} onChange={handleTokenChange}>
                {TOKENS.map((token) => (
                  <option key={token.tokenName} value={token.tokenName}>
                    {token.tokenName}
                  </option>
                ))}
              </select>
              <p>To: {toToken.tokenName}</p>
            </div>

            <JupiterSwap fromToken={fromToken} toToken={toToken} />
            <MeteoraSwap fromToken={fromToken} toToken={toToken} />
            <RaydiumSwap fromToken={fromToken} toToken={toToken} />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
