import React from "react";

import { scoreDataPush } from "../functions/scoreDataPush.jsx";

export async function triggerEndOfLoop(i,cpCount, myHandsTable, myTotalScore, outputData) {
	
	// console.log("Check for and trigger end of loop as completed.");

    // create temp node to hold the table data
    let handsContainer = document.createElement('div');
    handsContainer.innerHTML = myHandsTable;

    // console.log(handsContainer, "handsContainer");
    let handsTable = handsContainer.getElementsByTagName('table')[0];
    // console.log(handsTable, "handsTable");

	// console.log(handsTable.rows.length, "Rows in myHandsTable");
    let myHandsRowNum = handsTable.rows.length;

    let currentUserHands = [1,2,3,4,5];		// test data for user hands

	if( i+1 >= cpCount ) {		// cpCount.eq(iCompare)					

		console.log("Trigger ending of loop - only once! Outputting myHands to SCORES.");

		//if user has  full set of 5 hands, dislpay a the tail row on their user tbale with score summary
		if(myHandsRowNum > 4) {
			myHandsTable += '<tr>\
			      <th scope="col"></th>\
			      <th scope="col">Total Score: </th>\
			      <th scope="col">'+myTotalScore+'</th>\
			    </tr>';
		} else {
            myHandsTable += '<tr>\
			      <th scope="col">Total Score: </th>\
			      <th colspan=2 scope="col">Collect 5 Hands!</th>\
			    </tr>';
        }
		

		// output myHands first
		// console.log("Outputting myHands to SCORES. ");
		myHandsTable += "</tbody></table>";	// DOM element closer	
		let myHandDataArea = document.getElementById('player-scores');
		if(myHandDataArea){
			myHandDataArea.innerHTML =  myHandsTable;	// set user hands to DOM

		} else {
			// add it to the DOM
			myHandDataArea = document.createElement('div');
			myHandDataArea.id = "player-scores";
			myHandDataArea.innerHTML =  myHandsTable;	// set user hands to DOM
			// document.getElementById("dash").appendChild(myHandDataArea);
			console.log(myHandDataArea, "Created");

		}

		// call the output function
		scoreDataPush(outputData, cpCount);		// can this be called in parallel with the primary output function call?

	} else{
		return false;
	}

	return true;
}