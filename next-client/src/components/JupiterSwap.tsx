// JupiterSwap.tsx
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react"; // Import wallet hook
import { createJupiterApiClient } from "@jup-ag/api";
import { Connection } from "@solana/web3.js";
import { Spinner } from "./Spinner";
import { GetPoolsInfoApiResponse, PoolData } from "../types";
import { getPoolsInfo } from "../utils";
import PoolCard from "./PoolCard"; // Import the PoolCard component

const connection = new Connection("https://solana-api.projectserum.com");
const jupiterQuoteApi = createJupiterApiClient();

const JupiterSwap = () => {
  const allowedPoolsEnv = process.env.NEXT_PUBLIC_ALLOWED_POOLS
  const ALLOWED_POOL_IDS = allowedPoolsEnv || '8vMrQrYEM5H5i6JKwntfSMbhZNtSgu2qBoM9cYqmFGE6,HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv,CbnU6a4gPqjrdQ5aNj6kufheDDRmrZ7apW1osaDPHQbY';
  const [poolDataLoading, setPoolDataLoading] = useState<boolean>(false);
  const [poolData, setPoolData] = useState<PoolData[]>([]);

  useEffect(() => {
    (async () => {
      setPoolDataLoading(true);
      const response = await getPoolsInfo(ALLOWED_POOL_IDS);
      if (response.success) {
        setPoolData(response.data);
      }
      setPoolDataLoading(false);
    })();
  }, []);

  if (poolDataLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {poolData.map((pool) => (
        <PoolCard key={pool.id} pool={pool} />
      ))}
    </div>
  );
};

export default JupiterSwap;
