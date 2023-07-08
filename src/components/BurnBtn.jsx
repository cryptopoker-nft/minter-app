import React from "react";

import { useAccount, usePrepareContractWrite, useContractWrite } from 'wagmi'

import { cpContractPolygon, cpABIPolygon } from "../../js/modules/contracts.js";

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
	var fade = output;			//	document.getElementById("dash-content-area");
    // animation
    var intervalID = setInterval(function () {
          
        if (!fade.style.opacity) {
            fade.style.opacity = 1;
        }
          
        if (fade.style.opacity > 0) {
            fade.style.opacity -= 0.033;

            if(fade.style.opacity < 0.7) {
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
          
    }, 200);

	// handle the actual removal of the hand from storage
	// console.log("NEEDFIX ->Either refresh UI, or remove the correct one from the array list");
	// currentUserHands.pop();

	// FIRST WAIT, then reload the page
	setTimeout(() => {
		console.log("executing redirection after 5 seconds");
		// dashboard();

		location.reload();
	}, 5000);

	// LATER: will need to sync this to the DB /chain
		




	return true;
}

export function BurnBtn(props) {

    // console.log(props);
    console.log(props.tokenId);   // used
    console.log(props.title);   // used
    // let title = props.title;
    // console.log(props);

    //let tokenId = 1;
    // need token ID

    const { address, connector, isConnected } = useAccount();
	console.log(address);       // OK

	const { config } = usePrepareContractWrite({
		address: cpContractPolygon,
		abi: cpABIPolygon,
		functionName: 'transferFrom',
		args: [address, cpContractPolygon, props.tokenId]
	});
	
	const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const waitThenReload = () => {
    console.log("waiting 3 seconds then reloading");

    // play Burn Animation -> insert function call here

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }
   
    return (
      <div>

        <button 
            disabled={!write} 
            onClick={() => write?.()} 
            style={{color:"red","fontWeight":"bold", float:"right"}}>
            {props.title ? props.title : "Burn Hand NFT"}
        </button>
        {/* INTERNAL */}
        { isSuccess && <div>Transaction: {JSON.stringify(data)}</div> }
        { isSuccess && console.log(props.tokeId + " burned") }
        {/* USER */}
        { isLoading && <div>Check Wallet</div> }
        { isSuccess && foldHandBtn() }
        { /* isSuccess && alert("Hand has been burned!") */ }

      </div>
    )
}