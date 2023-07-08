import React from "react";

//getBalance
import { getBalance } from "../../js/viemConnect.js";
import { cpContractPolygon } from "../../js/modules/contracts.js";	

export async function scoreboardFinalOutput(gameData, gameTotal, sumData) {
	/***************************************
	 * 
	 * Final table output generated here
	 * *************************************/

	//compare with gameData from the database

	let activeGameNum = 1;


	let endTime = gameData.end_time;
	// let cptokenTreasury = parseInt(gameData.cptoken_treasury) - parseInt(gameData.token_sold);
	// let ethTreasury = gameData.eth_treasury;

	// let tokenTotal = gameData.token_total;	// in play, not minted
	// let tokenSold = gameData.token_sold;	// total out from treasury
	// let tokenSpend = gameData.token_spend;	// total number minted

	//TBD - convert to contract lookup for uniques
	// let activePlayers = gameData.unique_addr -1;		// -1 to account for contract ownership of burned hands
	// OLD: calculated from DB
	// let in_play = gameData.hands_in_play;
	let total = gameData.total_hands;
	// let fold = gameData.total_hands - gameData.hands_in_play;

	console.log("Testing for Equality - DB:" + total + " vs. Chain:" + gameTotal);		// expecting equality

	// get fold data by number of hands owned by contract address.
	let numFolded = await getBalance(cpContractPolygon);		//	cpContract.balanceOf(currentContract);		// this gets the number of hand owned by the contract address (i.e. folded)
	console.log("Num Folded: " + numFolded);

	let pairs = sumData[0];
	let twoPair = sumData[1];
	let trips = sumData[2];
	let quads = sumData[3];
	let straights = sumData[4];
	let flush = sumData[5];
	let fullHouse = sumData[6];
	let royal = sumData[7];

	// gametotal from cpCount -> passed in
	let realInPlay = gameTotal - Number(numFolded);
	let handsRemain = 10000 - gameTotal;

	let pairsPct = 100*pairs/realInPlay;
	let twoPairPct = 100*twoPair/realInPlay;
	let tripsPct = 100*trips/realInPlay;
	let quadsPct = 100*quads/realInPlay;
	let straightPct = 100*straights/realInPlay;
	let flushPct = 100*flush/realInPlay;
	let fullHousePct = 100*fullHouse/realInPlay;
	let royalPct = 100*royal/realInPlay;

	let finalSumock = '<table class="table table-dark table-striped">\
						  <thead>\
						    <tr>\
						      <th scope="col">Game#</th>\
						      <th scope="col">Played</th>\
						      <th scope="col">Remain</th>\
						      <th scope="col">InPlay</th>\
						    </tr>\
						  </thead>\
						  <tbody>\
						    <tr>\
						      <th scope="row">'+activeGameNum+'</th>\
						      <td>'+gameTotal+'</td>\
						      <td>'+handsRemain+'</td>\
						      <td>'+realInPlay+'</td>\
						    </tr>\
						    <tr>\
						      <td colspan="2">Pairs: '+pairs+' | '+pairsPct.toFixed(2)+'%</td>\
						      <td colspan="2">2 Pairs: '+twoPair+' | '+twoPairPct.toFixed(2)+'%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Triples: '+trips+' | '+tripsPct.toFixed(2)+'%</td>\
  						        <td colspan="2">Quads: '+quads+' | '+quadsPct.toFixed(2)+'%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Straights : '+straights+' | '+straightPct.toFixed(2)+'%</td>\
						    	<td colspan="2">Flush: '+flush+' | '+flushPct.toFixed(2)+'%</td>\
						    </tr>\
						    <tr>\
						    	<td colspan="2">Full House : '+fullHouse+' | '+fullHousePct.toFixed(2)+'%</td>\
						        <td colspan="2">Royal: '+royal+' | '+royalPct.toFixed(2)+'%</td>\
						        <td colspan="2"><!--Nothing : '+fullHouse+' | '+fullHousePct.toFixed(2)+'% --></td>\
						    </tr>\
						  </tbody>\
						</table>';

						//<tr>\<td colspan="2">Royal Flush: (TBD)</td>\</tr>\


	// DOM OUTOUT FINAL Summary TABLE HERE
	let finalTableOutputArea = document.getElementById('game-summary');
	if(finalTableOutputArea){
		// OK
	} else {
		// create it
		finalTableOutputArea = document.createElement('div');
		finalTableOutputArea.id = "finalGameData";
		// document.getElementById("dash").appendChild(finalTableOutputArea);
		console.log(finalTableOutputArea, "Created");
	}

	finalTableOutputArea.innerHTML = "<h3>Game: 00"+activeGameNum+"  from contract data<br/><small>ends: "+endTime+"</small></h3>" + finalSumock;

	return true;
}