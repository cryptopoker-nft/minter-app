import React from "react";

import { getFace, getCardDisplay, flipClick } from "../functions/displayCard.jsx";

export function Card(props){

	// console.log(props);		// just take ID

	// console.log("TODO: collect an array of all card IDs");
	let id = props.cardId;
	let collectible = props.collectible;
	// let setCollectibleCards = props.setCollectibleCards;
	if(collectible){
		// when called to display the cards in the dashboard, if the collectible flag is set, 
		// the card is owned, and the id is added to the array of owned cards
		// setCollectibleCards(id);
	}

	let frontImg = getFace(parseInt(id));		// this is not working, need to pass in the id as int?
	let backImg = getFace(0);		// get default of back face
	
	
	let cardDisplay = "00";
	if(id === "0"){
		// handle 0 case for id passed -> no card with ID0, but starts at object 0
		// cardDisplay = "00";
	} else {
		cardDisplay = getCardDisplay(parseInt(id)).display;
	}
	// console.log(cardDisplay, backImg, frontImg);
	
	// test for flipped or no
	let flipped = "";
	if(props.isFlipped) { 
		flipped = "flipped";
	} else if(props.collectible){
		flipped = "flipped"
	}

	return( <><div className="cardDisplay shown">{cardDisplay}</div>
			<div data_id={id} className={"flip-card " +flipped} onClick={(e) => flipClick(e.target)}>
				<div className="flip-card-inner">
					<div className="flip-card-front">
						<img className="card-back-img" src={backImg} alt="Card" />
					</div>
					<div className="flip-card-back">
						<img className="card-front-img" id="card-face" src={frontImg} alt="Card" />
					</div>
				</div>
			</div>
		</>);
}