'use client';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { BraveWalletAdapter } from '@solana/wallet-adapter-brave';
import {
    BitgetWalletAdapter,
    BitpieWalletAdapter,
    CloverWalletAdapter,
    Coin98WalletAdapter,
    CoinbaseWalletAdapter,
    CoinhubWalletAdapter,
    LedgerWalletAdapter,
    MathWalletAdapter,
    PhantomWalletAdapter,
    SafePalWalletAdapter,
    SolflareWalletAdapter,
    SolongWalletAdapter,
    TokenPocketWalletAdapter,
    TorusWalletAdapter,
    TrustWalletAdapter,
    WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { endpoint, network } from '../constants';
// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {



    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            ...(typeof window === 'undefined' ? [] : [new SolflareWalletAdapter()]),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new MathWalletAdapter({ endpoint }),
            new TokenPocketWalletAdapter(),
            new CoinbaseWalletAdapter({ endpoint }),
            new SolongWalletAdapter({ endpoint }),
            new Coin98WalletAdapter({ endpoint }),
            new SafePalWalletAdapter({ endpoint }),
            new BitpieWalletAdapter({ endpoint }),
            new BitgetWalletAdapter({ endpoint }),
            new CloverWalletAdapter(),
            new CoinhubWalletAdapter(),
            // new WalletConnectWalletAdapter({
            //   network: WalletAdapterNetwork.Mainnet, // const only, cannot use condition to use dev/main, guess is relative to walletconnect connection init
            //   options: {
            //     projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PJ_ID,
            //     metadata: {
            //       name: 'StraightUp',
            //       description: 'StraightUp',
            //       url: '',
            //       icons: ['https://.../logo/logo-only-icon.svg'],
            //     },
            //   },
            // }),
            new BraveWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Component {...pageProps} />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
