/*import { useState, useEffect } from "react";
import { useAccount, useContractRead } from "wagmi";
import { ethers } from "ethers";

// Supponiamo che tu abbia uno smart contract che restituisce la percentuale
const contractAddress = "0xYourContractAddressHere"; 
const contractABI = [
  {
    "inputs": [],
    "name": "getBranchFillPercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const Pyramid: React.FC = () => {
  const { address } = useAccount();
  const [percentage, setPercentage] = useState<number[]>([0, 0, 0, 0]); // percentuali di riempimento per ogni livello

  const maxAmount = 40000; // Numero massimo (questo è un valore che imposti tu)

  const { data, isLoading } = useContractRead({
    address: contractAddress,
    abi: contractABI,
    functionName: "getBranchFillPercentage", // Supponiamo che restituisca un numero da 0 a maxAmount
    watch: true
  });

  useEffect(() => {
    if (data) {
      // Calcola la percentuale di riempimento in base al numero massimo
      const filledPercentage = (data / maxAmount) * 100;

      // Imposta la percentuale per ogni livello
      setPercentage([filledPercentage, filledPercentage, filledPercentage, filledPercentage]);
    }
  }, [data]);

  return (
    <div className="pyramid-container">
      <div className="pyramid">
        {/* Per ogni livello della piramide }
        {percentage.map((percent, index) => (
          <div
            key={index}
            className="pyramid-level"
            style={{
              width: `${100 - index * 10}%`, // Più basso è il livello, più largo è
              height: "50px", // Altezza di ogni livello
              backgroundColor: `rgba(0, 128, 0, ${percent / 100})`, // Più il livello è riempito, più scuro è
              marginBottom: "5px", // Spazio tra i livelli
            }}
          >
            <div className="pyramid-label">
              {`Level ${index + 1}: ${percent.toFixed(2)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pyramid;*/

import React from 'react';
import './PyramidLoader.css'; // Assicurati di includere il file CSS

interface PyramidLoaderProps {
  value: number; // 'value' è di tipo 'number'
}

const PyramidLoader: React.FC<PyramidLoaderProps> = ({ value }) => {
  const maxValue = 100; // Il valore massimo (percentuale)

  // Calcoliamo il numero di livelli da completare in base al valore
  const levelsNumber = 8; // numero massimo di livelli sotto all'utente
  const levels = Math.ceil((value / maxValue) * levelsNumber); // 'levelsNumber' livelli sottostanti totali nella piramide

  const getColorForLevel = (level: number): string => {
    // Calcola un colore progressivo dal blu scuro all'azzurro chiaro
    const startColor = [0, 0, 139]; // Blu scuro (RGB: #00008b)
    const endColor = [135, 206, 250]; // Azzurro chiaro (RGB: #87cefa)

    const ratio = (level - 1) / 9; // Normalizza tra 0 (primo blocco) e 1 (ultimo blocco)

    const r = Math.round(2*startColor[0] - ratio * (endColor[0] - startColor[2]));
    const g = Math.round(2*startColor[1] - ratio * (endColor[1] - startColor[1]));
    const b = Math.round(2*startColor[2] - ratio * (endColor[2] - startColor[0]));

    return `rgb(${r}, ${g}, ${b})`;
  };

  const pyramid = [];

  // Creiamo la piramide come array di div
  for (let i = levelsNumber; i >= 0; i--) {
    const color = getColorForLevel(i); // Calcoliamo il colore per ogni livello
    pyramid.push(
      <div
        key={i}
        className={`pyramid-level ${i <= levels ? 'filled' : ''}`}
        style={{
          width: `${(1 + i) * 30}%`, // La larghezza si restringe man mano che scende
          backgroundColor: i <= levels ? color : '#ddd', // Colore dinamico o grigio
        }}
      ></div>
    );
  }

  return <div className="pyramid-container">{pyramid}</div>;
};

export default PyramidLoader;