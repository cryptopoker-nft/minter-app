import React from "react";

function counting(c,a) {
	c[a] = (c[a] || 0) + 1;
	return c;
}

export function quickAssessHand(handInput) {

	// just get and return the score using 
	// handInput = "XX XX XX XX XX";		// template

	const order = "23456789TJQK";
	let myCards = handInput.split(" ");	// separate back into cards

	if(myCards.length > 5) {
		//need a corrective hotfix to remove last element (blank)
		myCards.pop();
	}

	let myFaces = myCards.map(a => String.fromCharCode([77-order.indexOf(a[0])])).sort();		// subtract to get ordernum from a = 65
	let mySuits = myCards.map(a => a[1]).sort();

	// *********************************************************** /
	// FLUSH
	// *********************************************************** /

	let flush = mySuits[0] === mySuits[4];		// 1 and 5 match sorted, so all match

	// *********************************************************** /
	// DOUBLES, TRIPLES, 2 PAIR and FULL HOUSE in dups
	// *********************************************************** /

	// identify duplicates
	let myCounts = myFaces.reduce(counting, {});

	// console.log(myCounts);

	let duplicates = Object.values(myCounts).reduce(counting, {});

	// console.log(duplicates);

	// *********************************************************** /
	// STRAIGHT
	// *********************************************************** /

	let first = myFaces[0].charCodeAt(0);
	let isStraight = myFaces.every((f, index) => f.charCodeAt(0) - first === index);

	// *********************************************************** /
	// RANKING
	// *********************************************************** /

	 let rank = (flush && isStraight && 1) ||					// staright flush
	 			(duplicates[4] && 2) ||						// four of a kind
	 			(duplicates[3] && duplicates[2] && 3) ||	// full house
	 			(flush && 4) ||
	 			(isStraight && 5) ||
	 			(duplicates[3] && 6) ||			//	triples
	 			(duplicates[2] > 1 && 7) ||		// two pair
	 			(duplicates[2] && 8) ||			// pairs
	 			9;										// high card

	 // console.log(duplicates[3]);
	//  if(rank === 7) {
    //     /console.log(rank);
    //  }
	 return rank;
}