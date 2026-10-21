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
			buildGameHomeOuput();
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

	function gameBadges(df,dc){

		let condBuyInFee = "Free Faucet Claim*";

		if(!df){
			df = 0.001;
		}
		if(!dc){
			dc = "MATIC";
		}

		return "<ul class='badge-container'>\
			<li class='badge'>baseFees: "+df+" "+dc+"</li>\
			<li class='badge free'>"+condBuyInFee+"</li>\
		</ul>";
	}

	// tis uses JS to atrget the DOM and insert the game data content.
	async function buildGameHomeOuput() {

		// get the current number of hands in play
		let total_hands = Number(await checkCount(137));		
		let total_hands_op = Number(await checkCount(10));		
		let total_hands_arb = Number(await checkCount(42161));		
		let total_hands_base = Number(await checkCount(8453));		

		let end_time = "2023-09-01 11:00:00";
		let op_end_time = "2023-12-31 11:00:00";
		let arb_end_time = "2024-01-30 11:00:00";
		let base_end_time = "2024-01-30 11:00:00";

		// console.log("Running buildGameHomeOuput", end_time, total_hands);
		let pctNum = total_hands/100;	// 100/10000 for current percentage
		let opPctNum = total_hands_op/100;	// 100/10000 for current percentage
		let arbPctNum = total_hands_arb/100;	// 100/10000 for current percentage
		let basePctNum = total_hands_base/100;	// 100/10000 for current percentage


		let gameContainer = document.getElementsByClassName('gameHomeContainer');

		// init some variables
		let activeGameNum = 1;				// fixed
		let currentUserAddress = address;	// received via connection
		let currentUserPlays = Number(await getBalance(currentUserAddress,137));			// call getBalance to get current number of plays

		console.log("these vars should be loaded from a common repo or the API server");
		// let defaultFees = 0.001;
		// let defaultCurrency = "MATIC";

		let gameSponsorMessage = "<h4 class='sponsor-promo' title='today's sponsor or marketing promo link'>Play long term games with long term people <a href='https://nav.al/long-term' taregt='_blank'>...</a></h4><p><sup>*</sup>while supplies last</p>";
	
		// ALL: home page
	
		// add in the UI for social media
		document.getElementById('pageSocial').innerHTML = buildSocialMedia();
		// contentArea.innerHTML += twitterSocial;
	
	
		let contractChain = "Polygon ";	
	
		let gameData = "<div class='game-data' title='Should do a little progress bar style indicator here for each active game'>Game ID: <a href='#' onclick='scoreboard("+activeGameNum+")'>00"+activeGameNum+"</a> "+contractChain+" Contracts<br>Hands: <span id=gameTotalHands>"+total_hands+"</span>/10,000  -  Ends: <span id=gameEndTime>"+end_time+"</span><br>";
	
		let gameProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+pctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+pctNum+'%">'+pctNum+'%</div></div>';

		let opGame = "<div class='game-data' title=''>Game ID: <a href='#' onclick='scoreboard()'>002</a> OP Mainnet Contracts<br>Hands: <span id=gameTotalHands>"+total_hands_op+"</span>/10,000  -  Ends: <span id=gameEndTime>"+op_end_time+"</span><br>";

		let opProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+opPctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+opPctNum+'%">'+opPctNum+'%</div></div>';

		let arbGame = "<div class='game-data' title=''>Game ID: <a href='#' onclick='scoreboard()'>003</a> Arbitrum One Contracts<br>Hands: <span id=gameTotalHands>"+total_hands_arb+"</span>/10,000  -  Ends: <span id=gameEndTime>"+arb_end_time+"</span><br>";

		let arbProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+arbPctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+arbPctNum+'%">'+arbPctNum+'%</div></div>';

		let baseGame = "<div class='game-data' title=''>Game ID: <a href='#' onclick='scoreboard()'>004</a> Base Mainnet Contracts<br>Hands: <span id=gameTotalHands>"+total_hands_base+"</span>/10,000  -  Ends: <span id=gameEndTime>"+base_end_time+"</span><br>";

		let baseProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+basePctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+basePctNum+'%">'+basePctNum+'%</div></div>';


		// first Polygon game
		let gbPolygon = gameBadges(0.001, "MATIC");	
		let gameOutput = gameData + gameProgress + gbPolygon + "</div>";		// format game data and display
		// second OP game
		gameOutput += opGame + opProgress + gameBadges(0.00001, "ETH") + "</div>";		// format game data and display
		gameOutput += arbGame + arbProgress + gameBadges(0.00001, "ETH") + "</div>";		

		gameOutput += baseGame + baseProgress + gameBadges(0.00001, "ETH") + "</div>";		


		
		// this is for output of game promotional messgage and /or link
		gameOutput += gameSponsorMessage;
	
		gameContainer[0].innerHTML = gameOutput;
	}

    return homeAccordion;
}