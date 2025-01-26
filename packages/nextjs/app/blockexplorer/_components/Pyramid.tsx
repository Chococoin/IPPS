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
        { Per ogni livello della piramide }
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
import { useState, useEffect } from "react";

const Pyramid: React.FC = () => {
  const [percentage, setPercentage] = useState<number[]>([0, 0, 0, 0]); // percentuali di riempimento per ogni livello
  const [inputValue, setInputValue] = useState<number>(0); // Valore di input per la percentuale

  const maxAmount = 40000; // Numero massimo della piramide

  // Funzione per gestire la modifica del valore di input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(Number(e.target.value));
  };

  // Calcolare la percentuale di riempimento in base al valore dell'input
  useEffect(() => {
    if (inputValue >= 0 && inputValue <= maxAmount) {
      const filledPercentage = (inputValue / maxAmount) * 100;
      // Impostare la percentuale di riempimento per ogni livello della piramide
      setPercentage([filledPercentage, filledPercentage, filledPercentage, filledPercentage]);
    }
  }, [inputValue]);

  return (
    <div className="pyramid-container" style={{ textAlign: "center", paddingTop: "20px" }}>
      <h1>Piramide Dinamica</h1>

      {/* Input per inserire il valore che simula il riempimento */}
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min="500"
          max={maxAmount}
          placeholder="Inserisci valore"
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "150px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        />
        <p>Valore inserito: {inputValue}</p>
      </div>

      <div className="pyramid" style={{ marginTop: "20px" }}>
        {/* Per ogni livello della piramide */}
        {percentage.map((percent, index) => (
          <div
            key={index}
            className="pyramid-level"
            style={{
              width: `${100 - index * 10}%`, // Più basso è il livello, più largo è
              height: "50px", // Altezza di ogni livello
              backgroundColor: `rgba(0, 128, 0, ${percent / 100})`, // Più il livello è riempito, più scuro è
              marginBottom: "5px", // Spazio tra i livelli
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              position: "relative",
              /*boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",*/
            }}
          >
            <div className="pyramid-label" style={{ position: "absolute" }}>
              {`Livello ${index + 1}: ${percent.toFixed(2)}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pyramid;
