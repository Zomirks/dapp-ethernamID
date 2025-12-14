'use client';

import { useAccount, useReadContract } from 'wagmi';
import EternamID from "@/components/shared/EternamID";
import NotConnected from "@/components/shared/NotConnected";

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
