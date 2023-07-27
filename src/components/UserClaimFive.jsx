import React from "react";

import { faucetContract, faucetABI, cpFaucetOp, cpFaucetArb, cpFaucetBase } from "../data/contracts.jsx";

import { useContractWrite, usePrepareContractWrite } from 'wagmi'


// Contract WRITES using WAGMI
export function UserClaimFive({chainId, setPage}) {

    // common code
    const waitAndGoHome = () => {
        console.log("waiting 3 seconds then reloading");
  
        setTimeout(() => {

          alert("5 CPT Claimed!");

          // setPage("home");
          window.location.reload();   // for now reload to show new tokens (hopefully)

        }, 3000);
    }

    let currentFaucet = faucetContract;

    if(chainId === 8453) {
      currentFaucet = cpFaucetBase;
    } else if(chainId === 42161 ){          // ARBITRUM
      currentFaucet = cpFaucetArb;
    } else if(chainId === 10 ){             // OPTIMISM
      currentFaucet = cpFaucetOp; 
    } 
  
    // POLYGON
    const { config, error } = usePrepareContractWrite({
      address: currentFaucet,
      abi: faucetABI,
      functionName: 'requestTokens',
    })
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    function shortError(msg) {
      return msg.split(' ').slice(0, 18).join(' ')
    } 
    
    return (
      <div>
        <button className='btn btn-claim' disabled={!write || error} onClick={() => write?.()}>
            Claim 5CPT From Faucet
        </button>
        {error && (
          <div>{shortError(error.message)}</div>
        )}
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}

        {isSuccess && waitAndGoHome()        /*location.reload() /* go home for now */ }
      </div>
    )
    
  }