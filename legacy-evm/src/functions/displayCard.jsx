import React from "react";

// this should import constant variables that will never require to be changed after application is run.
import { 
    mainDeckBackIpfs,
    mainDeck1Ipfs,mainDeck2Ipfs,mainDeck3Ipfs,mainDeck4Ipfs,mainDeck5Ipfs,mainDeck6Ipfs,mainDeck7Ipfs,mainDeck8Ipfs,mainDeck9Ipfs,
    mainDeck10Ipfs,mainDeck11Ipfs,mainDeck12Ipfs,mainDeck13Ipfs,mainDeck14Ipfs,mainDeck15Ipfs,mainDeck16Ipfs,mainDeck17Ipfs,mainDeck18Ipfs,mainDeck19Ipfs,
    mainDeck20Ipfs,mainDeck21Ipfs,mainDeck22Ipfs,mainDeck23Ipfs,mainDeck24Ipfs,mainDeck25Ipfs,mainDeck26Ipfs,mainDeck27Ipfs,mainDeck28Ipfs,mainDeck29Ipfs,
    mainDeck30Ipfs,mainDeck31Ipfs,mainDeck32Ipfs,mainDeck33Ipfs,mainDeck34Ipfs,mainDeck35Ipfs,mainDeck36Ipfs,mainDeck37Ipfs,mainDeck38Ipfs,mainDeck39Ipfs,
    mainDeck40Ipfs,mainDeck41Ipfs,mainDeck42Ipfs,mainDeck43Ipfs,mainDeck44Ipfs,mainDeck45Ipfs,mainDeck46Ipfs,mainDeck47Ipfs,mainDeck48Ipfs,mainDeck49Ipfs,
    mainDeck50Ipfs,mainDeck51Ipfs,mainDeck52Ipfs,
} from "../../js/modules/main-vars.js";

import { buildDeck } from "./buildDeck.jsx";

// function testForFiveFlipped() {
// 	var allCards = document.getElementsByClassName("flip-card");

// 	console.log("This only works/is neededon MINT");
// 	// console.log(allCards);

// 	for (let card of allCards) {
// 		// console.log(card.classList);

// 		let thisCardClassLength = card.classList.length;

// 		// if classList contains only a single class, i.e. not flipped
// 		if (thisCardClassLength === 1) {
// 			// not yet all flipped
// 			return false;
// 			break;
// 		}

// 		// if it gets here, all cards should be flipped.
// 		// console.log("Trigger 5 flipped animation to reveal NFT.");

// 		return true;
// 	}
// }

export function flipClick(a, isMint){

	// newMint = false indicates that it is already face up -> not a new mint

	// console.log(a);
	a = a.parentNode.parentNode.parentNode;
	// console.log(a);

	console.log("FLIP CLICK - test for 5 flipped USED FOR AFTER MINT - OK");

	if(isMint){
		let allCards = document.getElementsByClassName("flipped");
		console.log(allCards);
		if(allCards.length >= 4){
			console.log("All 5 are flipped.");
			document.getElementById("nft-assess").style.display = "block";		// show image
		
			//show the nft image
			let nftImg = document.getElementById("nft-img");
			// nftImg.style.display = "block";		// show image
			nftImg.style.visibility = "visible";	// show image
			nftImg.style.opacity = "1";			// show image

		}
	}

	if(a){

		// default setting
		if (a.className === "flip-card " || a.className === "flip-card") {
			// set it
			a.className = "flip-card flipped";

			// add shown to the UI Display Card Rank and Suit.
			a.previousSibling.classList.add("shown");

			// check for is all 5 flipped and then set global handRevealed flag to true
			// console.log(a.parentNode.nextSibling);		// should get next card

			// if ( isMint && testForFiveFlipped() ) {

			// 	console.log("This should be a big animation reveal - TBD");

			// 	// isHandRevealed = true;
			// 	document.getElementById("nft-img").classList = " shown";		// show image
			// 	// enable the buttons (remove disabled from classList)
			// 	document.getElementById("playHand").classList = "btn btn-outline-success btn-lg";
			// 	document.getElementById("foldHand").classList = "btn btn-outline-danger btn-lg";
			// }
			

		} else {
			// reset it
			a.className = "flip-card";

			a.previousSibling.classList.remove("shown");

			// wait 400ms for card to flip and then update the reverse face image
			// setTimeout(updateFace(a), 500);
		}	
	
	}

}

export function getFace(id){

	// console.log(id);
	// parseInt(id);

	switch(id){
	case 1: return mainDeck1Ipfs; break;
	case 2: return mainDeck2Ipfs; break;
	case 3: return mainDeck3Ipfs; break;
	case 4: return mainDeck4Ipfs; break;
	case 5: return mainDeck5Ipfs; break;
	case 6: return mainDeck6Ipfs; break;
	case 7: return mainDeck7Ipfs; break;
	case 8: return mainDeck8Ipfs; break;
	case 9: return mainDeck9Ipfs; break;
	case 10: return mainDeck10Ipfs; break;
	case 11: return mainDeck11Ipfs; break;
	case 12: return mainDeck12Ipfs; break;
	case 13: return mainDeck13Ipfs; break;

	case 14: return mainDeck14Ipfs; break;
	case 15: return mainDeck15Ipfs; break;
	case 16: return mainDeck16Ipfs; break;
	case 17: return mainDeck17Ipfs; break;
	case 18: return mainDeck18Ipfs; break;
	case 19: return mainDeck19Ipfs; break;
	case 20: return mainDeck20Ipfs; break;
	case 21: return mainDeck21Ipfs; break;
	case 22: return mainDeck22Ipfs; break;
	case 23: return mainDeck23Ipfs; break;
	case 24: return mainDeck24Ipfs; break;
	case 25: return mainDeck25Ipfs; break;
	case 26: return mainDeck26Ipfs; break;

	case 27: return mainDeck27Ipfs; break;
	case 28: return mainDeck28Ipfs; break;
	case 29: return mainDeck29Ipfs; break;
	case 30: return mainDeck30Ipfs; break;
	case 31: return mainDeck31Ipfs; break;
	case 32: return mainDeck32Ipfs; break;
	case 33: return mainDeck33Ipfs; break;
	case 34: return mainDeck34Ipfs; break;
	case 35: return mainDeck35Ipfs; break;
	case 36: return mainDeck36Ipfs; break;
	case 37: return mainDeck37Ipfs; break;
	case 38: return mainDeck38Ipfs; break;
	case 39: return mainDeck39Ipfs; break;
		
	case 40: return mainDeck40Ipfs; break;
	case 41: return mainDeck41Ipfs; break;
	case 42: return mainDeck42Ipfs; break;
	case 43: return mainDeck43Ipfs; break;
	case 44: return mainDeck44Ipfs; break;
	case 45: return mainDeck45Ipfs; break;
	case 46: return mainDeck46Ipfs; break;
	case 47: return mainDeck47Ipfs; break;
	case 48: return mainDeck48Ipfs; break;
	case 49: return mainDeck49Ipfs; break;
	case 50: return mainDeck50Ipfs; break;
	case 51: return mainDeck51Ipfs; break;
	case 52: return mainDeck52Ipfs; break;
	default: return mainDeckBackIpfs; break;
	}

	

	// if(id === 1) { return mainDeck1Ipfs; } else
	// if(id === 2) { return mainDeck2Ipfs; } else
	// if(id === 3) { return mainDeck3Ipfs; } else
	// if(id === 4) { return mainDeck4Ipfs; } else
	// if(id === 5) { return mainDeck5Ipfs; } else
	// if(id === 6) { frontImg = mainDeck6Ipfs; } else
	// if(id === 7) { frontImg = mainDeck7Ipfs; } else
	// if(id === 8) { frontImg = mainDeck8Ipfs; } else
	// if(id === 9) { frontImg = mainDeck9Ipfs; } else
	// if(id === 10) { frontImg = mainDeck10Ipfs; } else
	// if(id === 11) { frontImg = mainDeck11Ipfs; } else
	// if(id === 12) { frontImg = mainDeck12Ipfs; } else
	// if(id === 13) { frontImg = mainDeck13Ipfs; } else

	// if(id === 14) { frontImg = mainDeck14Ipfs; } else
	// if(id === 15) { frontImg = mainDeck15Ipfs; } else
	// if(id === 16) { frontImg = mainDeck16Ipfs; } else
	// if(id === 17) { frontImg = mainDeck17Ipfs; } else
	// if(id === 18) { frontImg = mainDeck18Ipfs; } else
	// if(id === 19) { frontImg = mainDeck19Ipfs; } else
	// if(id === 20) { frontImg = mainDeck20Ipfs; } else
	// if(id === 21) { frontImg = mainDeck21Ipfs; } else
	// if(id === 22) { frontImg = mainDeck22Ipfs; } else
	// if(id === 23) { frontImg = mainDeck23Ipfs; } else
	// if(id === 24) { frontImg = mainDeck24Ipfs; } else
	// if(id === 25) { frontImg = mainDeck25Ipfs; } else
	// if(id === 26) { frontImg = mainDeck26Ipfs; } else

	// if(id === 27) { frontImg = mainDeck27Ipfs; } else
	// if(id === 28) { frontImg = mainDeck28Ipfs; } else
	// if(id === 29) { frontImg = mainDeck29Ipfs; } else
	// if(id === 30) { frontImg = mainDeck30Ipfs; } else
	// if(id === 31) { frontImg = mainDeck31Ipfs; } else
	// if(id === 32) { frontImg = mainDeck32Ipfs; } else
	// if(id === 33) { frontImg = mainDeck33Ipfs; } else
	// if(id === 34) { frontImg = mainDeck34Ipfs; } else
	// if(id === 35) { frontImg = mainDeck35Ipfs; } else
	// if(id === 36) { frontImg = mainDeck36Ipfs; } else
	// if(id === 37) { frontImg = mainDeck37Ipfs; } else
	// if(id === 38) { frontImg = mainDeck38Ipfs; } else
	// if(id === 39) { frontImg = mainDeck39Ipfs; } else

	// if(id === 40) { frontImg = mainDeck40Ipfs; } else
	// if(id === 41) { frontImg = mainDeck41Ipfs; } else
	// if(id === 42) { frontImg = mainDeck42Ipfs; } else
	// if(id === 43) { frontImg = mainDeck43Ipfs; } else
	// if(id === 44) { frontImg = mainDeck44Ipfs; } else
	// if(id === 45) { frontImg = mainDeck45Ipfs; } else
	// if(id === 46) { frontImg = mainDeck46Ipfs; } else
	// if(id === 47) { frontImg = mainDeck47Ipfs; } else
	// if(id === 48) { frontImg = mainDeck48Ipfs; } else
	// if(id === 49) { frontImg = mainDeck49Ipfs; } else
	// if(id === 50) { frontImg = mainDeck50Ipfs; } else
	// if(id === 51) { frontImg = mainDeck51Ipfs; } else
	// if(id === 52) { frontImg = mainDeck52Ipfs; } else
	// frontImg = mainDeckBackIpfs;

	// return frontImg;
}

export function getCardDisplay(id){

	// get card OBJECT from card id INT

	let tempDeck = buildDeck();
	let cardMatch = tempDeck.find(x => x.id === id);

	return cardMatch;

}

export function displayToId(display){

	// converts a card display (rank and suit), to a card id INT
	let tempDeck = buildDeck();		// used in card lookup

	// handle trailing commas
	if (display.charAt(display.length - 1) == ',') {
  		display = display.substr(0, display.length - 1);
		// console.log(display, " Fixed");
	}

	//console.log(display);

	// hotfixes 10s
	if(display === "10♠"){ return 10; /* console.log("wtf")*/ }
	if(display === "10♥"){ return 23; }
	if(display === "10♦"){ return 36; }
	if(display === "10♣"){ return 49; }

	// given display, return id
	let cardMatch = tempDeck.find(x => x.display === display);

	//console.log(cardMatch);

	if(!cardMatch) {
		return 9;
	} else if(cardMatch.id){
		return cardMatch.id;
	} else {
		console.log("Error");
		return "Error";
	}

}

export function displayCard(id, isFlipped) {
	// from card id, build up animated cardflip for css animation

    // init vars
	let cardDiv = "";
	let frontImg = "";

    // sample only
	// let card1ipfs = "https://cryptopoker.mypinata.cloud/ipfs/bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym";

	// A - Spades
	if(id === 1) { frontImg = mainDeck1Ipfs; } else
	if(id === 2) { frontImg = mainDeck2Ipfs; } else
	if(id === 3) { frontImg = mainDeck3Ipfs; } else
	if(id === 4) { frontImg = mainDeck4Ipfs; } else
	if(id === 5) { frontImg = mainDeck5Ipfs; } else
	if(id === 6) { frontImg = mainDeck6Ipfs; } else
	if(id === 7) { frontImg = mainDeck7Ipfs; } else
	if(id === 8) { frontImg = mainDeck8Ipfs; } else
	if(id === 9) { frontImg = mainDeck9Ipfs; } else
	if(id === 10) { frontImg = mainDeck10Ipfs; } else
	if(id === 11) { frontImg = mainDeck11Ipfs; } else
	if(id === 12) { frontImg = mainDeck12Ipfs; } else
	if(id === 13) { frontImg = mainDeck13Ipfs; } else

	if(id === 14) { frontImg = mainDeck14Ipfs; } else
	if(id === 15) { frontImg = mainDeck15Ipfs; } else
	if(id === 16) { frontImg = mainDeck16Ipfs; } else
	if(id === 17) { frontImg = mainDeck17Ipfs; } else
	if(id === 18) { frontImg = mainDeck18Ipfs; } else
	if(id === 19) { frontImg = mainDeck19Ipfs; } else
	if(id === 20) { frontImg = mainDeck20Ipfs; } else
	if(id === 21) { frontImg = mainDeck21Ipfs; } else
	if(id === 22) { frontImg = mainDeck22Ipfs; } else
	if(id === 23) { frontImg = mainDeck23Ipfs; } else
	if(id === 24) { frontImg = mainDeck24Ipfs; } else
	if(id === 25) { frontImg = mainDeck25Ipfs; } else
	if(id === 26) { frontImg = mainDeck26Ipfs; } else

	if(id === 27) { frontImg = mainDeck27Ipfs; } else
	if(id === 28) { frontImg = mainDeck28Ipfs; } else
	if(id === 29) { frontImg = mainDeck29Ipfs; } else
	if(id === 30) { frontImg = mainDeck30Ipfs; } else
	if(id === 31) { frontImg = mainDeck31Ipfs; } else
	if(id === 32) { frontImg = mainDeck32Ipfs; } else
	if(id === 33) { frontImg = mainDeck33Ipfs; } else
	if(id === 34) { frontImg = mainDeck34Ipfs; } else
	if(id === 35) { frontImg = mainDeck35Ipfs; } else
	if(id === 36) { frontImg = mainDeck36Ipfs; } else
	if(id === 37) { frontImg = mainDeck37Ipfs; } else
	if(id === 38) { frontImg = mainDeck38Ipfs; } else
	if(id === 39) { frontImg = mainDeck39Ipfs; } else

	if(id === 40) { frontImg = mainDeck40Ipfs; } else
	if(id === 41) { frontImg = mainDeck41Ipfs; } else
	if(id === 42) { frontImg = mainDeck42Ipfs; } else
	if(id === 43) { frontImg = mainDeck43Ipfs; } else
	if(id === 44) { frontImg = mainDeck44Ipfs; } else
	if(id === 45) { frontImg = mainDeck45Ipfs; } else
	if(id === 46) { frontImg = mainDeck46Ipfs; } else
	if(id === 47) { frontImg = mainDeck47Ipfs; } else
	if(id === 48) { frontImg = mainDeck48Ipfs; } else
	if(id === 49) { frontImg = mainDeck49Ipfs; } else
	if(id === 50) { frontImg = mainDeck50Ipfs; } else
	if(id === 51) { frontImg = mainDeck51Ipfs; } else
	if(id === 52) { frontImg = mainDeck52Ipfs; } else

	{ frontImg = mainDeckBackIpfs; } 
	
	// test for flipped or no
	let flipped = "";
	if(isFlipped) { flipped = "flipped";}

	// return (
	// 	<div className={"flip-card "+flipped} onClick={flipClick(this, isFlipped)}>
	// 		<div className="flip-card-inner">
	// 			<div className="flip-card-front">
	// 				<img className="card-back-img" src={mainDeckBackIpfs} alt="Card" />
	// 			</div>
	// 			<div className="flip-card-back">
	// 				<img class='card-front-img' id='card-face' src='"+frontImg+"' alt='Card' />
	// 			</div>
	// 		</div>
	// 	</div>
	// )

	// console.log("NEED TO ADD IN FUNCTION FOR FLIPPING CARDS");


	// generate the DOM object for the card
	cardDiv = "<div class='flip-card "+flipped+"' onclick='flipClick(this, false)'>";
	cardDiv += "<div class='flip-card-inner'>";
	cardDiv += "<div class='flip-card-front'>";
	cardDiv += "<img class='card-back-img' src='"+mainDeckBackIpfs+"' alt='Card' />";
	cardDiv += "</div>";
	cardDiv += "<div class='flip-card-back'>";
	cardDiv += "<img class='card-front-img' id='card-face' src='"+frontImg+"' alt='Card' />";
	// cardDiv += "<img class='card-front-img' id='card-face' src='../cards/faces/front-mock-"+id+".png' alt='Card' />";
	cardDiv += "</div>";
	cardDiv += "</div>";
	cardDiv += "</div>";

	// maybe try to return this as DOM object, or Function Component instead of string


	return cardDiv;
}

export function DisplayCard(props) {

	// test for flipped or no
	let flipped = "";
	if(props.isFlipped) { flipped = "flipped";}
	let face = getFace(props.id);

	// THIS IS MINT< SO FUNUCTION IS CALLED WITH TRUE

	return (
		<div className={"flip-card "+flipped} onClick={(e) => flipClick(e.target, true)}>
			<div className="flip-card-inner">
				<div className="flip-card-front">
					<img className="card-back-img" src={mainDeckBackIpfs} alt="Card" />
				</div>
				<div className="flip-card-back">
					<img className='card-front-img' id='card-face' src={face} alt='Card' />
				</div>
			</div>
		</div>
	)

	

}