import React from "react";

export function scoreHand(rank) {

	let thisHandScore = 0;

	if(rank === 1) { thisHandScore = 450; } 
	else if(rank === 2) { thisHandScore = 300; }	// quads
	else if(rank === 3) { thisHandScore = 150; }
	else if(rank === 4) { thisHandScore = 100; }	// flush
	else if(rank === 5) { thisHandScore = 80; }
	else if(rank === 6) { thisHandScore = 50; }		// triples
	else if(rank === 7) { thisHandScore = 25; }
	else if(rank === 8) { thisHandScore = 10; }		// pair
	else if(rank === 9) { thisHandScore = 1; }

	return thisHandScore;
}