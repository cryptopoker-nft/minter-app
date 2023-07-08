import React, { useEffect } from "react";
import { useAccount } from 'wagmi';

// import functions for checkCount and getBalance
import { checkCount, getBalance } from "../../js/viemConnect.js";
import { buildSocialMedia } from "../functions/buildSocialMedia.jsx";
import { homeAccordion } from "../data/homeAccordion.jsx";

export function HomeContent(props) {
	const { address, connector, isConnected } = useAccount();

	useEffect(() => {
		if(isConnected){
			// console.log(isConnected);
			getGameInfo(null,null,null);		// trigger data request
		}
	});

	// will need to call a function to get the game data
	async function getGameInfo(gameNum, isScoreboard, isNewMint) {		// activegamenum, false
	
		console.log("Get Game Info from API server:", gameNum, isScoreboard, isNewMint);
		// console.log("Dumb data getting smarter!");
	
		// console.log(checkCount);
	
		let gameData = null;
		let dumbData = {
			"end_time":"2023-09-01 11:00:00",
			"cptoken_treasury":"10000",
			"eth_treasury":0.38936235000000085637594793297466821968555450439453125,
			"token_total":93,
			"token_sold":263,
			"token_spend":-170,
			"unique_addr":30,
			"total_hands": Number(await checkCount),
			"hands_in_play":108
		};
	
		console.log(dumbData);
		gameData = JSON.parse(JSON.stringify(dumbData));

		buildGameHomeOuput(gameData.end_time, gameData.total_hands);		// generates the DOM for the user
		
	
	}

	// tis uses JS to atrget the DOM and insert the game data content.
	async function buildGameHomeOuput(end_time, total_hands) {

		console.log("Running buildGameHomeOuput", end_time, total_hands);
		let pctNum = total_hands/100;	// 100/10000 for current percentage
		let gameContainer = document.getElementsByClassName('gameHomeContainer');

		// console.log(gameContainer);

		// init some variables
		let activeGameNum = 1;				// fixed
		let currentUserAddress = address;	// received via connection
		let currentUserPlays = Number(await getBalance(currentUserAddress));			// call getBalance to get current number of plays

		console.log("these vars should be loaded from a common repo or the API server");
		let defaultFees = 0.001;
		let defaultCurrency = "MATIC";

		let gameSponsorMessage = "<h4 class='sponsor-promo' title='today's sponsor or marketing promo link'>Play long term games with long term people <a href='https://nav.al/long-term' taregt='_blank'>...</a></h4>";
	
		// ALL: home page
	
		// add in the UI for social media
		document.getElementById('pageSocial').innerHTML = buildSocialMedia();
		// contentArea.innerHTML += twitterSocial;
	
	
		let contractChain = "Polygon ";	
	
		let gameData = "<div class='game-data' title='Should do a little progress bar style indicator here for each active game'>Game ID: <a href='#' onclick='scoreboard("+activeGameNum+")'>00"+activeGameNum+"</a> "+contractChain+" Contracts<br>Hands: <span id=gameTotalHands>"+total_hands+"</span>/10,000  -  Ends: <span id=gameEndTime>"+end_time+"</span><br>"
	
		let gameProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+pctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+pctNum+'%">'+pctNum+'%</div></div>';
	
		let condBuyInFee = "1st Buy-In Free";
		let freePlay = "free";

		
	
		// currentUserPlays =  Number(await getBalance(currentUserAddress));		// set global variable

		console.log("Set current user plays to hand count number: %d", currentUserPlays);
	
		if(currentUserPlays > 0){
			freePlay = "";		//already redeemed freeplay
			condBuyInFee = currentUserPlays +"/5 hands in play";
		}
	
		let gameBadges = "<ul class='badge-container'>\
							<li class='badge'>baseFees: "+defaultFees+" "+defaultCurrency+"</li>\
							<li class='badge "+freePlay+"' onclick='addTokensPage()'>"+condBuyInFee+"</li>\
						</ul>";
	
		let gameOutput = gameData + gameProgress + gameBadges + "</div>";		// format game data and dsiplay
	
		// this is for output of game promotional messgage and /or link
		gameOutput += gameSponsorMessage;
	
		gameContainer[0].innerHTML = gameOutput;
	}

    return homeAccordion;
}