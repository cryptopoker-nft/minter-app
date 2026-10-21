// get the user profile from the main function for page data output
import { userProfile } from './myScript.js';

// export the navigation funciton for availability in the main site.
export async function mintPage() {
	console.log("Mint page is here");
	console.log(userProfile);		// these are getting here but are the unfinished version of the variables

	let contentArea = document.getElementById("contentArea");
	let userID = "<small>"+userProfile.address+"</small>";

	if(userProfile.username !== "") {
		// only assign the override if the value for username is set in storage
		userID = userProfile.username;
	}

	contentArea.innerHTML = "<hr><hr><p><strong>Welcome</strong> "+userID+" to the DEAL/MINT Page.</p><p>Pressing the button below to trigger the Mint action will spend one of your CP tokens, issue theNFT to be minted to your address and reveal your hand for play (HODL) or fold (FODL).</p><p><strong>Be advised: Burning hands is a one way process and cannot be reversed.</strong> Choose wisely!</p><hr>";
	contentArea.innerHTML += "<p>My Tokens: "+userProfile.tokens+"</p>";

	// console.log(currentUserHands);

	if (userProfile.hands.length >= 5) {
		console.log("Cannot mint more you have too many");
		contentArea.innerHTML += "Cannot mint more hands. <strong>You currently hodl the maximum number.</strong>.";
		contentArea.innerHTML += "<a class='btn btn-info' onclick='myProfile()'><strong>DASHBOARD</strong></a>";
	} else if (userProfile.tokens > 0) {
		contentArea.innerHTML += "<div class=text-center><a id='bigDeal' class='btn btn-lg btn-outline-primary' onclick='mintAction()'><strong>DEAL</strong></a><hr></div>";
		contentArea.innerHTML += '<iframe title="Playable Card Deck - Animation Samples" style="margin: 0 auto; width: 100%; height: 400px; border: 3px solid grey; border-radius: 20px;" src="https://tranmer.ca/tech/cards/"></iframe>';
	} else {
		contentArea.innerHTML += "<a class='btn btn-danger' onclick='addTokensPage()'><strong>BUY IN</strong></a>";
	}

}