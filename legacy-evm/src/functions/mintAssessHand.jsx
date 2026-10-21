import React from "react";

export function assessHand(hand) {

	function counting(c,a) {
		c[a] = (c[a] || 0) + 1;
		return c;
	}
	
	function byCountFirst(a,b) {
		 // counts are in reverrse orderr - bigger is better
		 const countDiff = counting[b] - counting[a];
	
		 if (countDiff) return countDiff;		// if counts don't match, return
		 return b > a ? -1 : b === a ? 0 : 1
	}

	let pairAttr = {
      "display_type": "boost_number", 
      "trait_type": "Pair", 
      "value": 10
    };

    let tripsAttr = {
      "display_type": "boost_number", 
      "trait_type": "Three Of A Kind", 
      "value": 25
    };
    let straightAttr = {
      "display_type": "boost_number", 
      "trait_type": "Straight", 
      "value": 50
    }
    let flushAttr = {
      "display_type": "boost_number", 
      "trait_type": "Flush", 
      "value": 80
    }
    let quadsAttr = {
      "display_type": "boost_number", 
      "trait_type": "Four Of A Kind", 
      "value": 100
    }
    let houseAttr = {
      "display_type": "boost_number", 
      "trait_type": "Full House", 
      "value": 150
    }
    let ultraAttr = {
      "display_type": "boost_number", 
      "trait_type": "StraightFlush", 
      "value": 450
    }

	// confirm hand is a valid object before proceeding
	if(!hand) {
		return null;

	} else {

		var outputString = "Nothing. Don't worry, 50% of hands are like this!";
		var currentHandAttr = [];

		// console.log("Working on assess Hand Function");
		// console.log(hand);

		// let c1v = hand.card1.value;
		// let c2v = hand.card2.value;
		// let c3v = hand.card3.value;
		// let c4v = hand.card4.value;
		// let c5v = hand.card5.value;

		// let c1s = hand.card1.suit;
		// let c2s = hand.card2.suit;
		// let c3s = hand.card3.suit;
		// let c4s = hand.card4.suit;
		// let c5s = hand.card5.suit;

		// console.log(c1v,c2v, c3v,c4v,c5v, " | ", c1s,c2s,c3s,c4s,c5s);

		const order = "23456789TJQK";
		let handInput = "XX XX XX XX XX";		// template

		handInput = hand.card1.solo + " " + hand.card2.solo + " " + hand.card3.solo + " " + hand.card4.solo + " " + hand.card5.solo;
		// console.log(handInput);		// as as single string, with separators


		let myCards = handInput.split(" ");	// separate back into cards
		let myFaces = myCards.map(a => String.fromCharCode([77-order.indexOf(a[0])])).sort();		// subrtact to get odernum from a = 65
		let mySuits = myCards.map(a => a[1]).sort();

		// console.log(myCards);
		// console.log(myfaces);		// not actual values, only refences
		// console.log(mySuits);


		// *********************************************************** /
		// FLUSH
		// *********************************************************** /

		let flush = mySuits[0] === mySuits[4];		// 1 and 5 match sorted, so all match
		// console.log(flush);


		// *********************************************************** /
		// DOUBLES, TRIPLES, 2 PAIR and FULL HOUSE in dups
		// *********************************************************** /

		// identify duplicates
		let myCounts = myFaces.reduce(counting, {})
		let duplicates = Object.values(myCounts).reduce(counting, {});
		// console.log(myCounts);
		// console.log(duplicates);


		// *********************************************************** /
		// STRAIGHT
		// *********************************************************** /

		// console.log("Testing Straight");
		// usig solo codes
		let first = myFaces[0].charCodeAt(0);
		let isStraight = myFaces.every((f, index) => f.charCodeAt(0) - first === index);
		// console.log(straight);

		

		// *********************************************************** /
		// RANKING
		// *********************************************************** /


		let rank = (flush && isStraight && 1) ||					// staright flush
					(duplicates[4] && 2) ||						// four of a kind
					(duplicates[3] && duplicates[2] && 3) ||	// full house
					(flush && 4) ||
					(isStraight && 5) ||
					(duplicates[3] && 6) ||
					(duplicates[2] > 1 && 7) ||
					(duplicates[2] && 8) ||
					9;										// high card

		// console.log(rank);


		//  value resolution
		let myValue = myFaces.sort(byCountFirst).join("");
		// console.log(myValue);		// relative?
		// console.log("High Card:" + myValue[0]);	// high card


		// generate all the outputs here based on the rankings received.

		if(rank === 8) {
			// one pair 
			// console.log("PAIR");
			outputString = "You got a pair! 42.2569% Probability.";
			currentHandAttr.push(pairAttr);
		} else if(rank === 7) {
			// console.log("TWO PAIR");
			outputString = "What! You got TWO pair! 4.7539% Probability.";
			currentHandAttr.push(pairAttr);
			currentHandAttr.push(pairAttr);		// push twice?
		} else if(rank === 6) {
			// console.log("TRIPLES");
			outputString = "Triples! Lucky! 2.1128% probability.";
			currentHandAttr.push(tripsAttr);
		} else if(rank === 5) {
			// console.log("STRAIGHT");
			outputString = "Ooh Lucky! <strong>0.3925% Probability</strong>. You got a straight"; 	 //with "+myValue[0]+" high! ";
			currentHandAttr.push(straightAttr);
		} else if(rank === 4) {
			// console.log("FLUSH");
			outputString = "So Lucky! <strong>0.2554% Probability</strong>. You got a flush with " + mySuits[0];
			currentHandAttr.push(flushAttr);
		} else if(rank === 3) {
			// console.log("FULL HOUSE");
			outputString = "Very Lucky! <strong>0.1441% Probability</strong>. You got a full house!";
			currentHandAttr.push(houseAttr);
		} else if(rank === 2) {
			// console.log("Assesed: 4 of a kind");
			outputString = "Ultra Lucky! <strong>0.02401% Probability</strong>. You got a four of a kind! ";
			currentHandAttr.push(quadsAttr);
		} else if(rank === 1) {
			// console.log("STRAIGHT FLUSH");
			outputString = "Supreme Lucky! <strong>0.02401% Probability</strong>. You got a stright flush! ";
			currentHandAttr.push(ultraAttr);
		} else {
			// rank 9 or nothing
			outputString = "Nothing. Don't worry, 50% of hands are like this!";
		}

		// console.log(outputString);

		return [outputString, rank, currentHandAttr];

	}

	// catch-all return area
	return null;

}