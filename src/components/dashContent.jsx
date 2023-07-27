import React, { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

import { getOwner, getURI } from "../../js/viemConnect.js";

// import { buildDeck } from "../functions/buildDeck.jsx";

import { HandContainer } from "./dashHandContainer.jsx";
import { getCpMeta } from "../functions/getCpMeta.jsx";
import { httpGet } from "../functions/xmlHttpReq.jsx";

import { Card } from "./Card.jsx";

// import { DisplayCard } from "../functions/displayCard.jsx";

export function CardCollection({deckCards}) {

	// let tempDeck = buildDeck();	// not needed here, can just generate ids
	// console.log(tempDeck);
	let deckIds = [	1,2,3,4,5,6,7,8,9,10,11,12,13,
					14,15,16,17,18,19,20,21,22,23,24,25,26,
					27,28,29,30,31,32,33,34,35,36,37,38,39,
					40,41,42,43,44,45,46,47,48,49,50,51,52];

	// console.log(deckCards.indexOf(16));

	const cardGrid = deckIds.map(id => (

			<Card 
				key={id} 
				cardId={id} 
				isFlipped={deckCards.indexOf(id) === -1 ? false : true} 
			/>
			
		)
	)

	return (<>
		{cardGrid}
	</>);

}

export function DashContent({cu, cc}) {
	const { address, connector, isConnected } = useAccount();

	const [infoBar, setInfoBar] = useState("STILL LOADING...");		// user feedback

	const [handOne, setHandOne] = useState([]);
	const [handTwo, setHandTwo] = useState([]);
	const [handThree, setHandThree] = useState([]);
	const [handFour, setHandFour] = useState([]);
	const [handFive, setHandFive] = useState([]);

	const [deckCards, setDeckCards] = useState([]);		// array of card ids

	// run only once, no dependancies
	useEffect(() => {
		if(isConnected && cc.name){

			// displayNFTs(cu,cc);		// just run it once?

			// declare the data fetching function
			const fetchData = async () => {

				let results = await displayNFTs(cu,cc);		// wait
				results ? console.log("Number of NFTs Owned: " + results.length) : console.log("No NFTs Owned");

			}
		  
			// call the function
			fetchData().catch(console.error);
	
		}
	},[]);

	async function displayNFTs(cu,cc) {
		// console.log("NFT OUTPUT PROFILE -> Display of all user owned NFTs");

		console.log("Running main NFT function... Runs ONCE to set all hands owned by user");

		let currentUserAddress = cu.address;	
		let totalCpSupply = Number(cc.count);		
		
		let myHandsMintNumArray = [];		// tracks hand numbers of active mints for user
	
		let cpMeta = await getCpMeta(cc.chainId);
		let cpMetaLocal = [];			// init an empty var
		
		if(cpMeta){

			console.log(cpMeta, totalCpSupply, cc.chainId);
	
			//check for globally stored cpMeta
			if(cpMeta.length > 0) {
				cpMetaLocal = cpMeta;		// use the global variable, cache it locally
			} 
	
		}

		// console.log(totalCpSupply);
	
		// this output for each uniquely owned NFT for connected wallet.
		for(let i=0;i<totalCpSupply;i++){	
	
			let thisNftOwner = "";

			let thisHandMeta = cpMetaLocal[i];
	
			if(thisHandMeta){
				//object exisits, assume we have basic ownership data for this hand
				
				// let thisHandMeta = cpMetaLocal[i];
	
				// if owner field is invalid or empty
				if(thisHandMeta.owner !== "") {
					// if local hand owner is NOT empty
	
					// console.log(thisHandMeta);
					// let ownerTest = thisHandMeta.owner;
					// console.log(thisHandMeta.owner.toLowerCase());
	
					if(thisHandMeta.owner && ( thisHandMeta.owner.toLowerCase() === currentUserAddress.toLowerCase() ) ){
						// if the current owner hand is owned by the user, and is stored in the DB
	
						// ONLY RETEST OWNED? - What about if bought off secondary?
						// verify ownership of the hand (not sold or traded)
						thisNftOwner = await getOwner(i, cc.chainId);
	
						// console.log(thisNftOwner);		// owner verification
	
						if( thisNftOwner && ( thisNftOwner.toLowerCase() !== currentUserAddress.toLowerCase() )){
							// update it with a direct on-chain lookup
							console.log("Owner Address Change : " + i);
							// console.log(thisNftOwner, currentUserAddress);
							cpMetaLocal[i].owner = thisNftOwner;
						} else {
							// console.log("Owner Remains the Same");
						}
	
	
					} 
	
				} else {
					// owner is empty update it here
					cpMetaLocal[i] = {};
					cpMetaLocal[i].owner = await getOwner(i, cc.chainId);
					cpMetaLocal[i].id = i;
				}
			} else {
				// create the object, assign the owner and id
				cpMetaLocal[i] = {};
				cpMetaLocal[i].owner = await getOwner(i, cc.chainId);
				cpMetaLocal[i].id = i;
	
				thisNftOwner = cpMetaLocal[i].owner;		// assign variable to test new MINTS
	
				// cpMetaLocal[i] = {id:i, owner:thisNftOwner};
				thisHandMeta = cpMetaLocal[i];
			}
	
			// continue on with the rest of the page load		
	
			// if the NFT is owned by the current user
			if(thisNftOwner && ( thisNftOwner.toLowerCase() === currentUserAddress.toLowerCase() )) {
				// current player owns this hand
				myHandsMintNumArray.indexOf(i) === -1 
					? 
						myHandsMintNumArray.push(i)
					: 
						console.log("This item already exists, skip it");

				let arrIndex = myHandsMintNumArray.indexOf(i);
				// console.log(arrIndex);

				// NEWMINTS: confirm and gather all the metadata, if missing
				// console.log(thisHandMeta.handArrDisplay.length);
				if(!thisHandMeta.handArrDisplay || thisHandMeta.handArrDisplay.length <= 0) {
					// we don't have what we need to build the hand, call the data capture function
					console.log("OOPS - need to capture the meta data for this hand to display for user.");

					setInfoBar("LOOKING UP NEW MINT #" + i + "...");

					let URIresult = await getURI(i, cc.chainId);
					// console.log(URIresult);

					let urlTarget = "https://cryptopoker.mypinata.cloud/ipfs/" + URIresult.slice(7);

					let jsonResult = await httpGet(urlTarget);
					// console.log(jsonResult);		// this is the JSON data for the NFT
					let parseRes = JSON.parse(jsonResult);

					let soloHash = parseRes.image.slice(7,66);			// clips out just the IPFS cid for the image of the NFT
					let thisFilename = parseRes.image.slice(67)	;		// clips out just the filename for use when calling the image				
					let thisImageUrl = "https://cryptopoker.mypinata.cloud/ipfs/" + soloHash+"/"+thisFilename;


					let nftName = parseRes.name;	// contains hand data!
					let nameSplit = nftName.split(" ");		// each array entry is a card in hand

					if(nameSplit.length < 7) {
						console.log("Error in Encode. Apply sample default to name");
						nameSplit = ["cpNFT","2022:","#191"," | ","9♠️","9♠️","9♠️","9♠️","9♠️"];
						//'cpNFT 2022: #'+mintnum + " | " + handName,
					} 

					// encoded hand data for html output, no comma to remove from 8
					cpMetaLocal[i].handArrDisplay = [ 
						nameSplit[4].substring(0, nameSplit[4].length - 1),
						nameSplit[5].substring(0, nameSplit[4].length - 1),
						nameSplit[6].substring(0, nameSplit[4].length - 1),
						nameSplit[7].substring(0, nameSplit[4].length - 1),
						nameSplit[8] 
					];

					cpMetaLocal[i].jsonMeta = jsonResult;
					cpMetaLocal[i].thisImageUrl = thisImageUrl;
					// html of link to image
					// html display of image

					thisHandMeta = cpMetaLocal[i];
					console.log(thisHandMeta);

					// now can send the update data
					switch(arrIndex) {
						case 0:
							setHandOne(thisHandMeta);
							break;
						case 1:
							setHandTwo(thisHandMeta);
							break;
						case 2:
							setHandThree(thisHandMeta);
							break;
						case 3:
							setHandFour(thisHandMeta);
							break;
						case 4:
							setHandFive(thisHandMeta);
							break;
						default:
							console.log("Hand is not in first five, (1-5) so it's omitted!");

					}

				} else {
					// ALL DATA FOR HAND BUILD OK
					// SET THE MAIN HAND DATA HERE - UPDATES DOM
					switch(arrIndex) {
						case 0:
							// console.log("Case 0");
							setHandOne(thisHandMeta);
							break;
						case 1:
							// console.log("Case 1");
							setHandTwo(thisHandMeta);
							break;
						case 2:
							if(handThree !== thisHandMeta) {
								setHandThree(thisHandMeta);
								break;
							}
						case 3:
							if(handFour !== thisHandMeta) {
								setHandFour(thisHandMeta);
								break;
							}
						case 4:
							// console.log("Case 4");
							if(handFive !== thisHandMeta) {
								setHandFive(thisHandMeta);
								break;
							}
						default:
							console.log("Hand is not in first five, (1-5) so it's omitted!");

					}
				}

				
	
	
	
			}
			
			// CHECK UI and TAIL OF LOOP		
	
			// Loading Indicator UI - used to track speed and caching
			if(i === totalCpSupply-1) {
				//last one, if exists
				if(document.getElementById('temp-loading')){
					
					setInfoBar("DONE LOADING!");
					setTimeout(() => {
						document.getElementById('temp-loading').remove();
					}, 3000);

					// console.log(hands);

					console.log(cpMetaLocal);
					console.log("To update the cpMeta object, data needs to be sent up to the API server? - maybe just send a cache update request...")
		
					return myHandsMintNumArray;
				}

			} else {
				// first add the temp-loading div if it doesn't exist
				if(!document.getElementById('temp-loading')){

					console.log("PANIC: should not get here ");

					let tempLoading = document.createElement('div');
					tempLoading.id = "temp-loading";
					tempLoading.classList = "colorYellow wallet-tx";
					tempLoading.innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";
					document.getElementById('loading-area').appendChild(tempLoading);
				} else {
				
					// append the number remainging to be processed
					// document.getElementById('temp-loading').innerHTML = "SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining";

					setInfoBar("SYNCING CURRENT HAND OWNERS... " + (totalCpSupply-i) + " remaining");
				}
			}
		}		// end for loop
	
		
		
	
		// update the server with the latest data
		// fetch("https://api.justplay.cafe/data/setMeta", {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 		},
		// 		body: JSON.stringify(cpMeta)
		// 	})
		// 	.then(response => response.json())
		// 	.then((json) => console.log(json));
	
	
		// let NFT_Page_Data = "<h1>Hi There</h1>";

		// console.log(hands);

		// return myHandsMintNumArray;
	
	}

	// console.log(deckCards);

    return (<>
	{isConnected ? 
		<>

			<p className="colorYellow">Contract: <strong>{cc.name}</strong>. {cu.handNum} {cc.symbol} owned on {cc.chainId === 10 ? "OPTIMISM" : cc.chainId === 42161 ? "ARBITRUM" : cc.chainId === 8453 ? "BASE" : "POLYGON"}
			<br /><b>Fresh Mints</b> and <b>Burns</b> can take time to sync on chain...</p>
			<hr />
			<h2 className="mainHeader">My Hands:</h2>
			{/* this is a list of all the hands the user owns */}

			
			<div id="dash-content-area">	
				<div id="loading-area">
					<h3 id='temp-loading' className='colorYellow wallet-tx'>
						{infoBar}
					</h3>
				</div>
						
				{handOne.handArrDisplay && <HandContainer handData={handOne} chainId={cc.chainId} setDeckCards={setDeckCards} deckCards={deckCards} /> }
				{handTwo.id && <HandContainer handData={handTwo} chainId={cc.chainId} setDeckCards={setDeckCards} deckCards={deckCards} /> }
				{handThree.id && <HandContainer handData={handThree} chainId={cc.chainId} setDeckCards={setDeckCards} deckCards={deckCards} /> }
				{handFour.id && <HandContainer handData={handFour} chainId={cc.chainId} setDeckCards={setDeckCards} deckCards={deckCards} /> }
				{handFive.id  && <HandContainer handData={handFive} chainId={cc.chainId} setDeckCards={setDeckCards} deckCards={deckCards} /> }

				{!handOne.id && !handTwo.id && !handThree.id && !handFour.id && !handFive.id && <p className="colorYellow">No Hands Owned - Go MINT Some!</p>}

			</div>

			<div style={{clear: "both"}}></div>

			<h2 className="mainHeader">My Card Collection:</h2>
			<div className="cardCollection">
				<CardCollection deckCards={deckCards} />
			</div>
			{deckCards.length > 0 && <p className="colorYellow">You own 		{deckCards.length} unique cards! I wonder what happens if you collect them all...</p>
			}
			{deckCards.length > 50 && <>
				<h4 className="colorOrange">You have enough to build a new deck!</h4>
				<button>Build Deck</button>
			</>
			}
			
			
		</> : <h3>Login Please</h3>}
	</>);
}