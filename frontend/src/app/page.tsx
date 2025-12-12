'use client';
import NotConnected from "@/components/shared/NotConnected";

import { useAccount, useReadContract } from 'wagmi';
import EternamID from "@/components/shared/EternamID";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <>
      {!isConnected ? (
        <NotConnected />
      ) : (
        <EternamID />
      )
      }
    </>
  );
}
