import React, {useRef} from "react";

import { useContractWrite, usePrepareContractWrite } from 'wagmi';

import { parseEther } from 'viem'

import { cpContractPolygon, cpABIPolygon, cpMintOp, cpMintArb, cpMinterABI, cpMintBase } from "../data/contracts.jsx";

import { MintAfterSave } from "./mintAfterSave.jsx";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

//UI - feeddback processing to user 
function processFeedback(feedback){
  // CLEAR AND ADD CURRENT to UI data area
  document.getElementById("dataArea").innerHTML = feedback; 

}

// step 4: Shows the MINT BUTTON UI && call the payToMint function with the URI (button press, after preparing the contract write)
export function MintHand(props) {
    // UI component, this will be a pre-validated button that triggers the minting process
  
    // console.log(props);

  
    let uri = props.myURI;
    let hand = props.hand;
    let address = props.address;
    let svg = props.svg;
    let defaultFees = props.defaultFees;
    let chainId = props.chainId;
    // let ready = props.ready;

    // error checking on input
    if(!defaultFees) {
        defaultFees = '0.001';		// 0.1% of 1 MATIC
    }
  
    if(!uri) {
      return (
        <div>
          <h3>DEAL HAND FIRST</h3>
        </div>
      )
    } else {
  
      // let defaultFees = '0.001';		// 0.1% of 1 MATIC
      // let singleToken = 1 * 10**18;   // represented with 18 digits
      // console.log(singleToken);

      let minterAddr = cpContractPolygon;

      if(chainId === 8453) {
        // BASE
        minterAddr = cpMintBase;
      } else if(chainId === 42161 ){
        // ARBITRUM
        minterAddr = cpMintArb;
      } else if(chainId === 10 ){
        // OPTIMISM
        minterAddr = cpMintOp;
      } else {
        // already defaults to polygon minter address
      }
    
      const { config } = usePrepareContractWrite({
        address: minterAddr,
        abi: cpMinterABI,
        functionName: 'payToMint',
        args: [	address, uri ],
        value: parseEther(defaultFees),
      })
      const { data, isLoading, isSuccess, write } = useContractWrite(config);

      if(isSuccess){
        console.log(document.getElementById('nft-img-two'))
        // document.getElementById('nft-img-two').scrollIntoView({ behavior: 'smooth'});
      }
    
      return (
        <>
          <button className="btn btn-lg btn-primary" disabled={!write} onClick={() => write?.()}>
              MINT 1 HAND
              {isSuccess ? <span className='colorBlack'> (done)</span> : null}
          </button>

          {isLoading && <p className="colorYellow">Check Wallet</p> }
          {isSuccess && <p className="colorYellow">Transaction: {JSON.stringify(data)}</p>}
          {isSuccess && console.log("1 cpNFT Received!")}
  
          {/* Feedback process 4 */}
          {isSuccess && processFeedback("<p class=subHeader title='contractAddress:"+cpContractPolygon+"'>1 cpNFT Received!<br />ADD Address: "+cpContractPolygon+" and Mint Number: "+hand.mintNum+" to your wallet.</p>")}
  
          { isSuccess && svg && uri && hand &&
            <MintAfterSave hand={hand} mintNum={hand.mintNum} svg={svg} uri={uri} />
          }

          {// isSuccess  &&
            // document.getElementById('nft-img-two').scrollIntoView({ behavior: 'smooth'})
          }
        </>
      )
    }
  }