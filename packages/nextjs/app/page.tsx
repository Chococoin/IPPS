"use client";

import type { NextPage } from "next";
import { useAccount, usePublicClient } from "wagmi";
import { ethers } from "ethers";
import Pyramid from "~~/components/Pyramid";
import "../components/PyramidLoader.css";
import background from "~~/components/assets/Background.png";
import React, { useState } from "react";


const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const publicClient = usePublicClient(); // provider pubblico
  const recipientAddress = "0xdb154273036613c5ace12fae6e4291aa6ea993ba"; // Recipiente (Pool)
  /*const [showPyramid, setShowPyramid] = useState(false);*/
  let showPyramid = true;

  const handlePayment = async () => {
    if (!publicClient) {
      alert("Wallet not connected. Please connect your wallet first!");
      /*setShowPyramid(true);*/
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(publicClient);
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther("1.0"),
      });
      console.log("Transaction sent:", tx);
      alreadyInvested = true;
      alert(`Transaction sent! Hash: ${tx.hash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Payment failed! Check the console for details.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
      }}
      className="flex items-center justify-center" // Centra
    >
      <div className="flex flex-col items-center justify-center text-center">
        <h1>
          <span className="text-6xl font-bold text-blue-500 animate-pulse">
            Interplanetary Pension System
          </span>
        </h1>
        <div className="mt-10">
          {!showPyramid && (
            <button
              onClick={handlePayment}
              className="bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-primary-focus transition-all"
            >
              Invest 1 ETH
            </button>
          )}
          {showPyramid && (
            <div className="flex justify-center items-center mt-10">
              <Pyramid value={75} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;