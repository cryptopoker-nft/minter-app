import React from "react";
// functions
import { displayToId } from "../functions/displayCard.jsx";
// components
import { Card } from "./Card.jsx";
import { BurnBtn } from "./BurnBtn.jsx";

// import { cpContractPolygon, cpMintOP } from "../../js/modules/contracts.js";

import { cpContractPolygon, cpMintArb, cpMintOp } from "../data/contracts.jsx";


// hand DOM export
export function HandContainer(props){

	// MAYBE need to pass cc, so we get current contract infofor proper OpenSea or other chain linking.

	// console.log(props);
	if(props.handData === undefined){
		return null;
	}

	let setDeckCards = props.setDeckCards;
	let deckCards = props.deckCards;
	
	// console.log(props.handData);

	let intArr = props.handData.handArrDisplay;
	// console.log(intArr);

	// we have: 5 card array of display cards
		// function: convert display hand to card id# for card component call

	let cardOne = 1;
	let cardTwo = 2;
	let cardThree = 3;
	let cardFour = 4;
	let cardFive = 5;

	if(intArr){
		cardOne = displayToId(intArr[0]);		// convert display to id
		cardTwo = displayToId(intArr[1]);
		cardThree = displayToId(intArr[2]);
		cardFour = displayToId(intArr[3]);
		cardFive = displayToId(intArr[4]);
	} 

	// id: is mintId
	// thisImageUrl: is the image url for the NFT

	//save the card ids as collectibles
	if(deckCards.indexOf(cardOne) === -1){
		// need to insert it
		setDeckCards([...deckCards, cardOne]);
	} if(deckCards.indexOf(cardTwo) === -1){
		setDeckCards([...deckCards, cardTwo]);
	} if(deckCards.indexOf(cardThree) === -1){
		setDeckCards([...deckCards, cardThree]);
	} if(deckCards.indexOf(cardFour) === -1){
		setDeckCards([...deckCards, cardFour]);
	} if(deckCards.indexOf(cardFive) === -1){
		setDeckCards([...deckCards, cardFive]);
	}
	// setDeckCards([...deckCards, cardTwo]);
	// setDeckCards([...deckCards, cardThree]);
	// setDeckCards([...deckCards, cardFour]);
	// setDeckCards([...deckCards, cardFive]);

	let thisId = props.handData.id;
	let thisIPFSsvg = props.handData.thisImageUrl;
	// let soloHash = props.handData.soloHash;
	// let thisFilename = thisIPFSsvg.;		// clip from imagename

	let osLink;

	if(props.chainId === 10){	

		osLink = "https://opensea.io/assets/optimism/"+cpMintOp+"/"+thisId;
		//https://opensea.io/assets/optimism/0xb83a46447900f0637baab08ffa8ed03447e10bf0/1418438

	} else if(props.chainId === 137){

		osLink = "https://opensea.io/assets/matic/"+cpContractPolygon+"/"+thisId;

	} else if(props.chainId === 42161){

		osLink = "https://opensea.io/assets/arbitrum/"+cpMintArb+"/"+thisId;

	}

	return (
		<div className="hand-container">
			{/* this is art and links */}
			<div className="nft-pen">
				<h3 className="colorYellow">
					<span style={{float:"right"}}>Mint ID#:{thisId}</span>
				</h3>
				<a className="nft-link" href={thisIPFSsvg} target="_blank">
					<img src={thisIPFSsvg} alt={thisIPFSsvg} style={{ width: "100%"}} />
				</a>
				<div className="small">
					<a href={osLink} target="_blank">
						View NFT on OpenSea</a>
					{thisId >= 0 && <BurnBtn tokenId={thisId} chainId={props.chainId} />}
				</div>
			</div>
			<hr />
			{/* this is flippable cards */}
			<div className="hand profile">
				<table>
					<tbody>
						<tr>
							<td>
								<Card cardId={cardOne} collectible={true} />							
							</td>
							<td>
								<Card cardId={cardTwo} collectible={true} />
							</td>
							<td>
								<Card cardId={cardThree} collectible={true} />
							</td>
							<td>
								<Card cardId={cardFour} collectible={true} />
							</td>
							<td>
								<Card cardId={cardFive} collectible={true} />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>);

}