import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styles from '../styles/Home.module.css';
import JupiterSwap from '../components/JupiterSwap';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
// const WalletDisconnectButtonDynamic = dynamic(
//     async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
//     { ssr: false }
// );

const Home: NextPage = () => {


    return (
        <div >

                <div className={styles.walletButtons}>
                    <WalletMultiButtonDynamic />
                    {/* <WalletDisconnectButtonDynamic /> */}
                </div>

            <JupiterSwap  />

        </div>
    );
};

export default Home;
