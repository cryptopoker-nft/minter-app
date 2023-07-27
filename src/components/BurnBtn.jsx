import React from "react";

import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi';

import { cpContractPolygon, cpABIPolygon, cpMinterABI, cpMintOp, cpMintArb, cpMintBase } from "../data/contracts.jsx";

// animation function
function foldHandBtn(output) {

  // output is DOM node, where you want the output
  // for now, just use the dataArea

  if(!output) {
    console.log("ERROR -> no output node passed to foldHandBtn");
    output = document.getElementById("dash-feedback");
  }

  // scroll to the output
  output.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

	console.log("Fancy animation -> burning animation, 8s countdown then explode");

	// expecting OUTPUT to pass in a DOM element .innerHTML to add the animation to
	// first add and style the flame
	output.innerHTML += "<div class='burn-container'><div class='flame'></div></div>";

	// countdown and add class explode 
	var fade = document.getElementById("main-container");
    // animation
    var intervalID = setInterval(function () {
          
        if (!fade.style.opacity) {
            fade.style.opacity = 1;
        }
          
        if (fade.style.opacity > 0) {
            fade.style.opacity -= 0.033;

            if(fade.style.opacity < 0.79) {
            	// light the fuse
	            fade.classList = "explode";
			} 

			if (fade.style.opacity < 0.5) {
				// bail
				clearInterval(intervalID);
				// location.reload();
				// dashboard();		// send user back to dashboard
			}

        } else {
            clearInterval(intervalID);
        }
          
    }, 300);

	// handle the actual removal of the hand from storage
	// console.log("NEEDFIX ->Either refresh UI, or remove the correct one from the array list");
	// currentUserHands.pop();

	// FIRST WAIT, then reload the page
	setTimeout(() => {
		console.log("executing redirection after 5 seconds");
		// dashboard();

		location.reload();
	}, 4000);

	// LATER: will need to sync this to the DB /chain
		




	return true;
}

export function BurnBtn(props) {

  const { address, connector, isConnected } = useAccount();

  //console.log(props);       // OK
  let chainId = props.chainId;
  let mintAddr = cpContractPolygon;   // default to polygon

  if(chainId === 8453) {
    mintAddr = cpMintBase;
  } else if(chainId === 42161) {
    // console.log("connected to ARBITRUM");
    mintAddr = cpMintArb;

  } else if(chainId === 10) {
    // console.log("connected to OPTIMISM");
    mintAddr = cpMintOp;

  } else if(chainId === 137) {
    // no change needed ATM

  } else {
    // dont have chain ID, not connected?
    return (
      <div>
        "Please Wait"
      </div>
    )
  }

  const { config } = usePrepareContractWrite({
    address: mintAddr,
    abi: cpMinterABI,
    functionName: 'transferFrom',
    args: [address, mintAddr, props.tokenId]
  });
  
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>

      <button 
          disabled={!write} 
          onClick={() => write?.()} 
          style={{color:"red","fontWeight":"bold", float:"right"}}>
          {props.title ? props.title : "Burn Hand NFT"}
      </button>
      {/* INTERNAL */}
      { isSuccess && <div className="colorOrange">Transaction: {JSON.stringify(data)}</div> }
      { isSuccess && console.log(props.tokeId + " burned") }
      {/* USER */}
      { isLoading && <div className="colorYellow">Check Wallet</div> }
      { isSuccess && foldHandBtn() }
      { /* isSuccess && alert("Hand has been burned!") */ }

    </div>
  )

	

  // const waitThenReload = () => {
  //   console.log("waiting 3 seconds then reloading");

  //   // play Burn Animation -> insert function call here

  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 3000);
  // }
   
    
}