// start of application

// PARADOX: Needs to be a module to IMPORT / export, but then cannot access functions using onclick?

// import { storeImageData } from './modules/ipfs.js';
// console.log(storeImageData);

//web3

function whenConnected() {
	// verify wallet connection and send connection request
	setCookie("isLoggedIn", true);
	setCookie("currentTokens", currentUserTokens);

	// console.log('accessing all player hands');		// -> update currentUserHands in order to make use of the output structure below.

	getHands();

	// currentUserHands = myHands;

	// set global js variable for logged in to true
	isLoggedIn = true;

	// logged in users go to the profile page
	UIloop();
	// myProfile();

}

async function connectMetaMask() {
	// Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        //window.web3 = new Web3('https://rpc-mumbai.matic.today');

        try {
            // Request account access if needed
            console.log("Successful Attempt to Connect via MetaMask");

            // await ethereum.enable();
            await window.ethereum.send('eth_requestAccounts');
            // await window.ethereum.sendAsync('eth_requestAccounts');
            // Acccounts now exposed
            // web3.eth.sendTransaction({/* ... */});

            // testing can we get the latest eth blocknumber?
            web3.eth.getBlockNumber(function (error, result) {
								// console.log(result);

								//good here!
							});

            // testing: can we get connected account public address?
            let connectedAccounts = web3.eth.getAccounts();
            // console.log(connectedAccounts);		// returns Promise -> should be string for address only
            // web3.eth.getAccounts(console.log);

            connectedAccounts.then(function(result) {
            	// console.log(result);	// should be the result of the promise here
            	let accountNum = result[0];
            	// console.log(accountNum);

            	// we got it, so we can use the connected account number when generating the user account in main contract storage
            	createUserAccount(accountNum);

            	// set global var for easy access
            	currentUserAddress = accountNum;

            	isDemo = false;

            	// run connection subroutine
            	whenConnected();

            });


        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});

        // test tx
        web3.eth.getBlockNumber(function (error, result) {
								console.log(result)
							});

        console.log("Account connected via MetaMask Classic");
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');

        alert("Browser Window is a no-go. Please use MetaMask Browser or Desktop with Extension.");

        alert("Application will continue in demo mode only on this browser and nothing will be saved.");

        whenConnected();
    }
}


// test button only
async function sendTx(amt) {

	if(amt === '') {
		amt = "0.00000001";
	}

	// amt.toString();

	console.log("Test Tx - send: " + amt.toFixed(16));

    let testWallet = "0x63bf70C967c5627B45d7B0c245781D3F04447D48";

    let sendTx = web3.eth.sendTransaction({from: currentUserAddress,to: testWallet, value: web3.utils.toWei(amt.toFixed(16), "ether")})
				.then((receipt) => {
					console.log(receipt);
					alert("Transaction completed successfully!");
				});
}

// on token purchase
async function sendTxAndBuy(amt) {

	if(amt === '') {
		amt = "0.00000001";
	}

	console.log("Test Tx - send: " + amt.toFixed(16));

    let testWallet = "0x63bf70C967c5627B45d7B0c245781D3F04447D48";

    alert("Trigger please wait screen behind wallet confirmation popup.")

    let sendTx = web3.eth.sendTransaction({from: currentUserAddress,to: testWallet, value: web3.utils.toWei(amt.toFixed(16), "ether")})
				.then((receipt) => {
					console.log(receipt);
					alert("Transaction completed successfully! Clear wait screen.");

					buyTokensForEth(tokenMaxNum);

				});

}

function saveFileIpfs() {

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "https://api.nft.storage/upload", true); 
	xhttp.setRequestHeader("Content-Type", "multipart/form-data");
	xhttp.setRequestHeader("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEIzMTg1OTlhZTUwM0Q2ZjgzODA1NDNiNWY3OTNFNjQ5QTU4MENGYmUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0MDIwOTc4MjU3OSwibmFtZSI6ImNwX25mdF9zdG9yYWdlIn0.NM5PgU0bP67L3yn_ILXKgVN1WjUrMJoxnqfNJ05XzFc");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;
	   }
	};
	var data = {address:currentUserAddress,gameId: 1,hand: handString, svg:svg};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));


	// full curl
	/*

	curl -X 'POST' \
  'https://api.nft.storage/upload' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -H 'Authorization: Bearer WyIweGVjMmNkYTE0MTA0NTY4YWIxYTQwMmZiODJiYmExNDMxYmUwZjEwZDI2MjAxNTFkZjZlNDI5NzlhNjM5MjI0MWUyYmUzMGM2ZGVhMWQwNzA1YTY1NzYxMWJkNmViNGQ3N2E5ZDY0NjVjZmE2Y2NlOGEwNzYzZjJiYTNjMzYyMTc1MWIiLCJ7XCJpYXRcIjoxNjQxNDc3MjMxLFwiZXh0XCI6MTY0MTQ4NDQzMSxcImlzc1wiOlwiZGlkOmV0aHI6MHhCMzE4NTk5YWU1MDNENmY4MzgwNTQzYjVmNzkzRTY0OUE1ODBDRmJlXCIsXCJzdWJcIjpcInJ5a0lwM2IxdnFuSmN1d3lheDlyY1dkVVgwZ2NQYU5qUUh5N0hWbm5TZG89XCIsXCJhdWRcIjpcIlpvYmw1QzJHRWVvT1dudXdpb0RURDRBSnd1NlhFTW5WSEttWjZWOFZZLUU9XCIsXCJuYmZcIjoxNjQxNDc3MjMxLFwidGlkXCI6XCJmZjA1NTE1MS0wZWUxLTRiMjctODhkZC0yZDU2NjE4ODJjZThcIixcImFkZFwiOlwiMHg2MjBhYTI2YzMzOTJmM2M3ZmFhN2MxNjQzMTBhOGIzNmJiZGZiMDQyMGE5OGY5YjY0ZTNiZDUwZTFmNjE3N2FmMTNlYzYxOWZhMmM4Y2U0NGExZGM3ZjRhOGQwZTVjMjNiNDFmY2NkMWY2YTE5MDZhYzczYjA4MWJmNmZjNzAzNzFjXCJ9Il0=' \
  -F 'file=@img-test (1).svg;type=image/svg+xml'

  */
}


/********************** END blockchain specific interaction code ****************/


// main app

// global application variables - init
var isLoggedIn = false;
var UIArea = document.getElementById("UIArea");
var contentArea = document.getElementById("contentArea");

// for demo wallet user only
var isDemo = true;

// current user data storage
var currentUserAddress = "";
var currentUserTokens = getCookie('currentTokens');	// new wallets start with 0 tokens
var currentUserHands = [];		// use getHands function to access an array of the currrent user hands
// if (getCookie('currentUserHands') > 0) {
// 	currentUserHands = getCookie('currentUserHands');	// an array of objects of type HAND
// }

var isHandRevealed = false;		// boolean toggle for display of cards in hand, display codes.
var buyNum = 1;								// default buy number - DEPRECIATED
var tokenMaxNum = 5;				// maximum number of tokens avaialble 
var activeGameNum = 1;				// display for active game number (when multiple games are simultanuously in play)

// button prototypes
let walletConnectBtn = "<a href='#' id='connectWallet' class='btn btn-primary' onclick='getConnected()'>Connect Wallet / Login</a>";
let walletConnectedBtn = "<a href='#' id='connectedWallet' class='btn btn-secondary'></a>";	// Wallet Connected removed
let mintBtn = "<a href='#' id='mintBtn' class='btn btn-outline-primary'></a>";	// DEAL LABEL REMOVED - ADDED BACK WITH CSS for dynamic
// let tokenCounter = "<h2><span class='badge bg-secondary'>"+currentUserTokens+"</h2>";

// IPFS connections to card images for use in app & nft building
// Spades
var mainDeckBackIpfs = "https://bafybeifqmquol5qqzcycxfski6ygzb36cxvb6drj6zwsaqqc7ntpoggag4.ipfs.dweb.link";	// back art
var mainDeck1Ipfs = "https://bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym.ipfs.dweb.link";			// A - Spades
var mainDeck2Ipfs = "https://bafybeicbh7ha56qzjc2yfrmnwhi6sy4xaougfccthyayiij3rkma3ycgte.ipfs.dweb.link";		// 2 -Spades
var mainDeck3Ipfs = "https://bafybeif64xmkdw37g3j3hbgbk6zjr652tbfnomenspn4qs2ghckvqhywsa.ipfs.dweb.link";		// 3 -Spades
var mainDeck4Ipfs = "https://bafybeibnkq7djhqw5dp67peds6jidp3dvjdxmzkucaap3y5fhqpkpchkla.ipfs.dweb.link";		// 4 -Spades
var mainDeck5Ipfs = "https://bafybeifabkwl35c7vjkk32zypzaf3mah7eakuk3zw36u7an7yxkmmygveq.ipfs.dweb.link";		// 5 -Spades
var mainDeck6Ipfs = "https://bafybeiccv32yxyi75cmyu3lyggpkul6gyedddv3q3o3mxmqa4qlvoclnfu.ipfs.dweb.link";		// 6 -Spades
var mainDeck7Ipfs = "https://bafybeiasu3edvhxjjnw65r3jrrvjessmt5pkf33ytivl2tc5jrncy37eiq.ipfs.dweb.link";		// 7 -Spades
var mainDeck8Ipfs = "https://bafybeibdiuodmblfk4ecnk6o3n2hltfg2j6nwvu6uzdby7docx22rcdd3q.ipfs.dweb.link";		// 8 -Spades
var mainDeck9Ipfs = "https://bafybeidpsqiaxnxpgockpht7ecqaeu5pb33uwca5gbodalcdihb66fyqyy.ipfs.dweb.link";		// 9 -Spades
var mainDeck10Ipfs = "https://bafybeihwnp5lbmh7hxlayygx6hl7av54dcdblbatyqblddycgtmflkya2a.ipfs.dweb.link";		// 10 -Spades
var mainDeck11Ipfs = "https://bafybeidvz3a5y55rxwcstuvys7b4g56hnrcfnmp7qdfvinwl4nde6wztja.ipfs.dweb.link";		// J - Spades
var mainDeck12Ipfs = "https://bafybeic2bp2uohmqsbs3aa3sqn5olkdj43pf6g4nkc7jejfm6h74udh6gq.ipfs.dweb.link";		// Q -Spades
var mainDeck13Ipfs = "https://bafybeibckznpp76427qsd4hf74epva445fmuloeid4jicttrgdcgkj2pmy.ipfs.dweb.link";		// K -Spades
// Hearts
var mainDeck14Ipfs = "https://bafybeicc5ppnndblirjsvszgqbnj2cuakoladvrbdwz7dsdi47z4kcssl4.ipfs.dweb.link";
var mainDeck15Ipfs = "https://bafybeie7lbe7piavel4celocm4nitytkjdb4c4j6b2qvgpl2xph2up22ty.ipfs.dweb.link";
var mainDeck16Ipfs = "https://bafybeidlhzopv5di4i4j5pu7sh5i7hrjxmafxyrrjhaway73ebyg5qcuxu.ipfs.dweb.link";
var mainDeck17Ipfs = "https://bafybeigo5ng5z7rur6godmnyehbbwzpciy7gatefaavomyxhojxxnlj4qe.ipfs.dweb.link";
var mainDeck18Ipfs = "https://bafybeigtyxk6bsok6y7bva4rbjblghvrarb5bjpu7mrelklmwdhvcagihm.ipfs.dweb.link";
var mainDeck19Ipfs = "https://bafybeif3nrxgwmr4cxzayvv5q5wcvkoj2zkr7fhvgfxbiceg3ge7nctxq4.ipfs.dweb.link";
var mainDeck20Ipfs = "https://bafybeiatbyhy2jkssj7gfq5brfc2fklvkctewwmzaozuzktmu6nr57kxsi.ipfs.dweb.link";
var mainDeck21Ipfs = "https://bafybeichdgpmuzhvcalw7c3cng5hyiapl33l3mnfn5a7aien6h5n2kbwxe.ipfs.dweb.link";
var mainDeck22Ipfs = "https://bafybeicd6gb4c267tfebbunv7gjh2sr5syui4z5y6iheofu7wunzeplh64.ipfs.dweb.link";
var mainDeck23Ipfs = "https://bafybeihgkio5we23api2q6soldkjecu4qx6jc7lh7tmxoakpdjcho3g4p4.ipfs.dweb.link";
var mainDeck24Ipfs = "https://bafybeighdsvapdmvxkzgaqxmbsyi426oh6hx2kyh5jwumly7pldznudetm.ipfs.dweb.link";
var mainDeck25Ipfs = "https://bafybeihvuvbvozmsl5ynyyby5jbt7ftlpbep3niiek7fww5xiwtdibnjbm.ipfs.dweb.link";
var mainDeck26Ipfs = "https://bafybeie5hsefyfvdwda6ybs5laaqvtq6iay4kwtqe4zlthh74hznaiqb7i.ipfs.dweb.link";
// Diamonds
var mainDeck27Ipfs = "https://bafybeidyyl5je3sssgu2cqtbfsiudu3uphgzwsavtjgdlum4vhuifh26bm.ipfs.dweb.link";
var mainDeck28Ipfs = "https://bafybeidwksaegho7jlexc4rlnzqkppk6vl4nt5bwxta3a2ek6mvwevhrdy.ipfs.dweb.link";
var mainDeck29Ipfs = "https://bafybeieyvtgq2j3ulbf6elt2z5d7exuzwfekekjntrkj7jchnwddpd5n4i.ipfs.dweb.link";
var mainDeck30Ipfs = "https://bafybeibgfzlbwtmjgjaftorge5oigvut3wfcre3yv7hg6sbkuhpfk76udi.ipfs.dweb.link";	// 4
var mainDeck31Ipfs = "https://bafybeigxbtmrtpvjercmh72smnfruiht7vvjqs2brbavifmxpe6j73jtk4.ipfs.dweb.link";
var mainDeck32Ipfs = "https://bafybeidpswgtgldpydipzf7d6h7eyeouazbazqumtwzueeoucke3chtu5y.ipfs.dweb.link";
var mainDeck33Ipfs = "https://bafybeicixdgug5kbyx74taqwabv5i33vtxqvywsxcyhin6xgc4afhoaiuu.ipfs.dweb.link";	// 7
var mainDeck34Ipfs = "https://bafybeic2cwfv3iv3d7jazyc44kzn5kzsc3pyhpkabqxpyiqdbapmc322bu.ipfs.dweb.link"; 
var mainDeck35Ipfs = "https://bafybeickwbzgnerdryvsmbnsrc6w7kgicporfa62k2hgrlbb43hqy4avgi.ipfs.dweb.link";
var mainDeck36Ipfs = "https://bafybeih6vf6e3e6efv5omyygbbbs6hukyb7ixnzx76eljliqutl5q4gkve.ipfs.dweb.link";
var mainDeck37Ipfs = "https://bafybeibk7tk5o5mycksi7b7o2zgarbgkphbr2yxj3vj277n7uc5cakdxtq.ipfs.dweb.link";
var mainDeck38Ipfs = "https://bafybeiczvslukdwq2eprqp5qnvfycuxco5yfiu4pe2v26ckdbuypkqmtyi.ipfs.dweb.link";	// Q
var mainDeck39Ipfs = "https://bafybeidyh3qsd7qwshuyhy23l2j7r5shaak6ckvwgretthscx4ytwfut5m.ipfs.dweb.link";
// Clubs
var mainDeck40Ipfs = "https://bafybeicsl4ey6tyqm4sshs7aappbdpdx4s3mgpuhg4pf6lhg2ry5i6fypm.ipfs.dweb.link";	// A
var mainDeck41Ipfs = "https://bafybeihhj3yxezzc5in7pu5gbeklrazgcse2ingafbf6xgqwedsvzhxgcy.ipfs.dweb.link";
var mainDeck42Ipfs = "https://bafybeied5qgvk3y5al7rtu4w6jbrkbathd44jya4hg5fgsjn2m7g2hfchm.ipfs.dweb.link";
var mainDeck43Ipfs = "https://bafybeih32qnsk5z3esn7r35wuk3fc5hosbwhtlefcz5jeiig7ji4p654yy.ipfs.dweb.link";
var mainDeck44Ipfs = "https://bafybeihgi6owbc64x2zjack2u2e2ynre5kbtzh2odvkhv3cjhbnxy5tkry.ipfs.dweb.link";
var mainDeck45Ipfs = "https://bafybeibu45oij4wlktc4rczhjifmtref3kpsmja5ay46f5jinri7almety.ipfs.dweb.link";
var mainDeck46Ipfs = "https://bafybeicam667cpvax3lxofmlcp5cp5hzdr2lut4mx3mp4h563zpneqkv5e.ipfs.dweb.link";
var mainDeck47Ipfs = "https://bafybeie4bvib3pgycc4me2efapmnovcuwentlahuyfu3nytnnggelfx4ny.ipfs.dweb.link";
var mainDeck48Ipfs = "https://bafybeig2qwartbxtv5ocb5s7cbkeywbev6qryj5udoaxeof6ykiaht4d24.ipfs.dweb.link";
var mainDeck49Ipfs = "https://bafybeif5ajwe6nkbvvo4lxiievscg4gt65rd7ud5fmw2psre2hsigoxwq4.ipfs.dweb.link";
var mainDeck50Ipfs = "https://bafybeia2ah36lsvgilaal24wv4j22n2ccwhbftpokrqgt3kofairxclzga.ipfs.dweb.link";
var mainDeck51Ipfs = "https://bafybeiewpnsl2lndtm7y3drqzlz6bv3n6jdd7fvlgnfuf4wjlqtle7wue4.ipfs.dweb.link";
var mainDeck52Ipfs = "https://bafybeid6a6vngp2h4ucvaoqpvyshn7nz3o7oce3qv4lc3q6vw7kcinwpvm.ipfs.dweb.link";



/************************************* DATABASE ACCESS AREA ************************************/


function saveMint(gameId, hand, svg) {

	// submit this entry to php to handle temporary local data storage for games
	// we need to send: address, gameId, hand

	// console.log(hand);
	// console.log(svg);

	// console.log(currentUserAddress);
	console.log('Submit Mint Entry -> ' + gameId + ' ' + currentUserAddress);
	// console.log(hand);

	let handString = hand.toString();

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/save-mint.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;
	   }
	};
	var data = {address:currentUserAddress,gameId: 1,hand: handString, svg:svg};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));

}

function buildHandFromStoredData(hand) {
	// generate a hand from an array of IDs

		let handId = hand.slice(1);
		let handClip = hand.slice(6, -1);
		let hand_arr = handClip.split(',');

		// for each hand, convert to card storage and push to current user hand, as per below.

		var deckDeal = buildDeck();

		let card1_id = parseInt(hand_arr[0]);
		let card2_id = parseInt(hand_arr[1]);
		let card3_id = parseInt(hand_arr[2]);
		let card4_id = parseInt(hand_arr[3]);
		let card5_id = parseInt(hand_arr[4]);

		let card1 = deckDeal.filter(obj => {
			return obj.id === card1_id;
		});
		let card2 = deckDeal.filter(obj => {
			return obj.id === card2_id;
		});
		let card3 = deckDeal.filter(obj => {
			return obj.id === card3_id;
		});
		let card4 = deckDeal.filter(obj => {
			return obj.id === card4_id;
		});
		let card5 = deckDeal.filter(obj => {
			return obj.id === card5_id;
		});
		// console.log(card1);

		// push the one hand onto the current hands stack
		currentUserHands.push({
				card1: card1[0],
				card2: card2[0],
				card3: card3[0],
				card4: card4[0],
				card5: card5[0]
			});


	// if(hand.length < 5) {
	// 	// hand is invalid
	// 	currentUserHands = [];
	// }

	return "Card object added to currentUserHands";
}

function updateCurrentHands(hands) {

	// FIRST: handle a single hand being sent in

		// THEN: handle an array of objects being sent into this function

	// console.log(hands);

	let jsonHands = JSON.parse(hands);

	jsonHands.forEach(element => {

		buildHandFromStoredData(element);

	});
		
	// These (all hands) should all be available here.

	// console.log(currentUserHands);
	// console.log("Lazy: this could instead be a reload of just the hands area of the profile page...")
	
	myProfile();

	// if "hands" input is undefined, then override the value of currentUserHands to be an empty array.

}

function getHands() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "query/get-hands.php?addr="+currentUserAddress, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {

	      // Response
	      var response = this.responseText; 

	      // use response to build/update currentPlayerHands global variable
	      updateCurrentHands(response);

	   }
	};
	xhttp.send();

}

function createUserAccount(account) {
	// console.log('Submit Account Connection -> ' + account);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/create-account.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     // console.log(response);
	     // contentArea.innerHTML += response;

			if(response === 'true') {
				// true response indicates a new a ccount was created 
				// -> new account onboarding subroutine here TBD
			} else {
				// they already have an account -> welcome back message
				console.log("Check for extended profile information available and use username.");
				console.log("Welcome back " + account);

				myProfile();
			}

	   }
	};
	var data = {address:account};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}

// to get the logged in user data and return it to the contentArea UI
function getUserProfileData() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/get-user-profile-data.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     // var response = this.responseText;

	     // console.log(response);
	     const profileData = JSON.parse(this.responseText);
	     // contentArea.innerHTML += response;

			// if(response === 'true') {
			// 	// true response indicates a new a ccount was created 
			// 	// -> new account onboarding subroutine here TBD
			// } else {
			// 	// they already have an account -> welcome back message
			// 	console.log("Check for extended profile information available and use username.");
			// 	console.log("Welcome back " + account);
			// }

		buildUserProfileDataOutput(profileData);

	   }
	};
	var data = {address:currentUserAddress};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}


function buildUserProfileDataOutput(data) {

	console.log(data);

	// add something to allow editable areas to be selectable
	if(data.username === "") {
		data.username = "Click_To_Set_Username";
	}

	if(data.email === "") {
		data.email = "Click_To_Set_Email";
	}

	let dataOutput = "<p><strong>Username: </strong><a onClick='editUsername(this)' href='#'>" + data.username + "</a>";
	dataOutput += "<br><strong>Email Address: </strong><a onClick='editEmail(this)' href='#'>" + data.email + "</a></p>";
	dataOutput += "<hr><p><strong>Number of buy-ins: </strong>" + data.buyins;
	dataOutput += "<br><strong>Number of Hands Played: </strong>" + data.hands_played;
	dataOutput += "<br><strong>Total Spent: </strong>" + data.total_spent + "</p>";

	contentArea.innerHTML += dataOutput;
}


function saveEmail(newEmail) {
	// access db storage to upload user data
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/update-user-profile.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;

		if(response === 'true') {
			// true response indicates a new a ccount was created 
			// -> new account onboarding subroutine here TBD
			alert("Account email successfuly updated.");

			// return to edit profile page
			editProfile();
		} else {
			// they already have an account -> welcome back message
			console.log("Error. " + response);
			// console.log("Welcome back " + account);
		}

	   }
	};
	var data = {address:currentUserAddress, username: "", email: newEmail};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}


function saveUsername(newUsername) {

	// access db storage to upload user data
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/update-user-profile.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;

		if(response === 'true') {
			// true response indicates a new a ccount was created 
			// -> new account onboarding subroutine here TBD
			alert("Account username successfuly updated.");

			// return to edit profile page
			editProfile();
		} else {
			// they already have an account -> welcome back message
			console.log("Error. " + response);
			// console.log("Welcome back " + account);
		}

	   }
	};
	var data = {address:currentUserAddress, username: newUsername, email: ""};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));

}

function usernameSaveTest(event) {
  if (event.keyCode == 13) {
     console.log("Enter key is pressed");
     // gather the input field data and send to storage
     let newUsername = document.getElementById("userName").value;
     console.log(newUsername);

     saveUsername(newUsername);

     return true;
  } else {
     return false;
  }
}

function emailSaveTest(event) {
  if (event.keyCode == 13) {
     console.log("Enter key is pressed");
     // gather the input field data and send to storage
     let newEmail = document.getElementById("userEmail").value;
     saveEmail(newEmail);
     return true;
  } else {
     return false;
  }
}


function editUsername(this_element) {
	console.log(this_element);
	// replace with an edit field to update / add username

	// editingUsername = true;

	// if(editingUsername) {
		let currentUsername = this_element.innerHTML;

		if(currentUsername === 'Click_To_Set_Username'){
			this_element.innerHTML = '<input type="text" class="form-control" id="userName" aria-describedby="emailHelp" placeholder="'+currentUsername+'" onkeypress="usernameSaveTest(event)"><small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small>';
		} else {
			this_element.innerHTML = '<input type="text" class="form-control" id="userName" aria-describedby="emailHelp" value="'+currentUsername+'" onkeypress="usernameSaveTest(event)"><small id="emailHelp" class="form-text text-muted">We\'ll never share your email with anyone else.</small>';
		}

		

		document.getElementById("userName").focus();
		// document.getElementById("userEmail").addEventListener("keypress",  );

		// eventually this needs to be set back to false after the edits have completed.
		// editingUsername = false;
	// }

	

	// monitor for return keypress in this element and on return press, trigger the update of the data storage
}


function editEmail(this_element) {
	console.log(this_element);

	let currentEmail = this_element.innerHTML;

	if(currentEmail === 'Click_To_Set_Email'){
		this_element.innerHTML = '<input type="email" class="form-control" id="userEmail" aria-describedby="emailHelp" placeholder="'+currentEmail+'" onkeypress="emailSaveTest(event)">';
	} else {
		this_element.innerHTML = '<input type="email" class="form-control" id="userEmail" aria-describedby="emailHelp" value="'+currentEmail+'" onkeypress="emailSaveTest(event)">';
	}

	

	document.getElementById("userEmail").focus();
	// monitor for return keypress in this element and on return press, trigger the update of the data storage
}


function getGameInfo(gameNum, isScoreboard) {
	// console.log('Submit Account Connection -> ' + account);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/get-game-info.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    // Response
	    var response = this.responseText;

	    // console.log(response);

	    const gameData = JSON.parse(this.responseText);
		if(isScoreboard){ printScoreboardData(gameData); } else 
		{ setHandHome(gameData); }

		// return gameData;

	  }
	};
	var data = {gameNum:gameNum};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}


function getBuyinCost(gameNum) {
	// console.log('Submit Account Connection -> ' + account);

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/get-buyin-cost.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    // Response
	    var numPlays = this.responseText;

	    console.log(numPlays);

	    outputBuyinCost(numPlays);

	    //should just be a simple value for number of buyins already based on gamenum and address

	    // const gameData = JSON.parse(this.responseText);
		// if(isScoreboard){ printScoreboardData(gameData); } else 
		// { setHandHome(gameData); }

		// return gameData;

	  }
	};
	var data = {gameNum:gameNum,address:currentUserAddress};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}


function tokenClaimSuccessOutput() {
	contentArea.innerHTML = "<h3>Congrats, you got Token(s)</h3>";
	// contentArea.innerHTML += "<p>My Address: <small>"+userProfileDemo.address+"</small></p>";
	contentArea.innerHTML += "<p>My Tokens: "+currentUserTokens+"</p>";
	contentArea.innerHTML += "<div class=text-center><a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a></div>";

	UIloop();	// to refresh the token balance indicator

}


// token treasury
function buyTokensForEth(numTokens) {

	console.log("likely numTokens no longer required here.");

	// if we require metamask confirmation of transaction before running this function, then we're cler to proceed with the internal data update.

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/buy-tokens-for-eth.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log("Add "+response+" token(s) to current user balance - db.");
	     // console.log(response);
	     // contentArea.innerHTML += response;

	     currentUserTokens = response;

	     tokenClaimSuccessOutput(response);


	   }
	};
	var data = {address:currentUserAddress,gameNum: activeGameNum, numTokens: numTokens };
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));


}

// spend one token from transacting user.
function spendOneToken() {

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/spend-one-token.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log("Remove one token from current user balance - db.");
	     console.log(response);
	     // contentArea.innerHTML += response;
	   }
	};
	var data = {address:currentUserAddress,gameNum: 1};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));


}

// get user balance for gameNum and update UI areas
function calculateUserBalance(gameNum) {

	// console.log("Getting User Balance from records");

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/get-user-balance.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	  if (this.readyState == 4 && this.status == 200) {
	    // Response
	    var response = this.responseText;

	   	// console.log(response);

	    //const gameData = JSON.parse(this.responseText);

		// return gameData;

		// set var -> currentUserTokens
		currentUserTokens = response;
		// UIloop();
		// call to next function or 

		// update the display area with values
		let balanceUI = document.getElementsByClassName("token_balance");
		// console.log(balanceUI);

		Array.from(balanceUI).forEach(element => {

			// console.log(element);
			element.innerHTML = currentUserTokens;

		});

	  }
	};
	var data = {gameNum:gameNum, address:currentUserAddress};
	// console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));

	 
	
}


/***********************************************************************************************/


// determine if user is logged in
if ( isWalletConnected() ) {
	isLoggedIn = true;

	// logged in users go to the profile page
	// myProfile();
} 

// init the UI Loop
console.log("UI Loop on page load - init");
UIloop();
/*******************************************************/
// function farm
/*******************************************************/

// generate the appropriate UI based on the logged in user status
function UIloop() {

	// generate the correct button to be displayed based on logged in status on page
	if ( isLoggedIn ){
		UIArea.innerHTML = mintBtn + walletConnectedBtn;
		UIArea.innerHTML += "<h2><span class='badge bg-secondary token_balance'>"+currentUserTokens+"</h2>"; // tokenCounter;
		document.getElementById("connectedWallet").addEventListener("click", myProfile);
		document.getElementById("mintBtn").addEventListener("click", mintPage);

		// myProfile();
	} else {
		UIArea.innerHTML = walletConnectBtn;
		// document.getElementById("connectWallet").addEventListener("click", getConnected);

		home();
	}
}

function isWalletConnected() {
	// console.log("Running isWalletConnected");

	if ( getCookie("isLoggedIn") === "true" ) {
		console.log("Cookie flagged as logged in");

		connectMetaMask();

		return true;
	}

	return false;
}

function getConnected() {
	console.log("Running getConnected");

	connectMetaMask();

	UIloop();

	return true;
}

/** Cookie Helper functions **/

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

/** Page / internal functions **/

function goHome(clicked_this) {

	removeActiveMenus();

	console.log(clicked_this);
	clicked_this.classList.toggle("active");

	// any cleanup actions required to reset to get ready to handle the home page
	home();
}

function home() {
	/* load the home page

	this page should display:
	- list of all current games (if logged in, actively participating games on top)
		- some games may be "pinned" to the top of the list
	- button to goto profile (if logged in)
	- button to login wallet (if not logged in)

	*/ 

	var buttons = "<a href='#' class='btn btn-outline-primary btn-lg' onclick='getConnected();'>Connect Wallet</a>";
	var homePageContent = '';


		// override buttons to display primary navigation buttons instead
		homePageContent += "<h2>Goals for Game 0:</h2>";
		homePageContent += "<ul><li>Introduce/test fundamental cryptopoker mechanics: <ul><li>Buy Tokens</li><li>Mint Hand</li><li>Manage/Burn Hands</li></ul></li><li>Gather data for prizing potential of future games</li><li>Assess game mechanics and potential for how to attack the game.</li><li>Gather a 'whitelist' of connected wallet addresses from players as basis for future game launches.</li><li>Provide UI for profile managment for username, email for future communications.</li></ul><hr />";
		homePageContent += "<p><strong>Instructions and information needed here about the game and rules.</strong></p>";
		homePageContent += "<ul><li>You may only hold a combined total of 5 hands and tokens to mint at anytime. No hoarding!</li>";
		homePageContent += "<li>First 5 tokens per wallet address connected are free to claim. <li></li>Subsequent token claims beyond the first one will incur a (simulated) cost. This (eventual) payment will form the basis for future game prizing and continued development of game features.</li></ul>";

	if(!isLoggedIn) {
		// not logged in, just display a big connect button.
		homePageContent += "<div class='button-container'>"+buttons+"</div>";

	}

	homePageContent += "<hr><h3>Games In Play:</h3>";
	homePageContent += "<ul class='gameHomeContainer'></ul>";

	homePageContent += "<hr><h3>Upcoming Games:</h3>";
	homePageContent += "<ul><li><a href='#'>TBD</a></li></ul>";

	contentArea.innerHTML = homePageContent;

	// call the data acquisition function
	buildGameHome();

}



function setHandHome(gameData) {

	// this is async and handles the replacemnt of the placeholder staging data for the game
	// -> better to reorder to output to occur after we have this data.

	console.log("Set Hand Home");
	// console.log(gameData);

	buildGameHomeOuput(gameData.end_time, gameData.total_hands);

}

function buildGameHome() {

	// console.log("Use PHP function to get game data for current game from live record.");
	getGameInfo(activeGameNum, false);

	return true;
}

function buildGameHomeOuput(end_time, total_hands) {

	// document.getElementById('gameEndTime').innerHTML = end_time;
	// document.getElementById('gameTotalHands').innerHTML = total_hands;

	let pctNum = total_hands/100;	// 100/10000 for current percentage

	let gameContainer = document.getElementsByClassName('gameHomeContainer');

	// console.log(gameContainer);

	let gameData = "<li title='Should do a little progress bar style indicator here for each active game'>Game ID: <a href='#' onclick='scoreboard("+activeGameNum+")'>00"+activeGameNum+"</a><br>Hands: <span id=gameTotalHands>"+total_hands+"</span>/10,000  -  Ends: <span id=gameEndTime>"+end_time+"</span><br>"

	let gameProgress = '<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+pctNum+'" aria-valuemin="0" aria-valuemax="100" style="width: '+pctNum+'%">'+pctNum+'%</div></div>';

	let gameOutput = gameData + gameProgress + "</li>";

	// console.log(gameOutput);

	gameContainer[0].innerHTML = gameOutput;
}


function assembleDisplayCard(id, isFlipped) {
	// from card id, build up animated cardflip for css animation
	// let cardDiv = "<img src='../cards/faces/front-mock-"+id+".png' alt ='Card Image' />";
	let cardDiv = "";

	// console.log(id);
	let frontImg = "";

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

	cardDiv = "<div class='flip-card "+flipped+"' onclick='addClick(this, "+isFlipped+")'>";
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


	return cardDiv;
}


function addClick(a, newMint) {

	// newMint = false indicates that it is already face up -> not a new mint

	// console.log(a);
	if (a.className === "flip-card") {
		// set it
		a.className = "flip-card flipped";

		// get the card displayed in a.previousSibling and unhide the display visibility.
		a.previousSibling.classList = " shown";

		// check for is all 5 flipped and then set global handRevealed flag to true
		// console.log(a.parentNode.nextSibling);		// should get next card
		if ( testForFiveFlipped(newMint) ) {

			console.log("This should be a big animation reveal - TBD");

			isHandRevealed = true;
			document.getElementById("nft-img").classList = " shown";
			document.getElementById("playHand").classList = "btn btn-outline-success btn-lg";
			document.getElementById("foldHand").classList = "btn btn-outline-danger btn-lg";
		}
		

	} else {
		// reset it
		a.className = "flip-card";

		// wait 400ms for card to flip and then update the reverse face image
		// setTimeout(updateFace(a), 500);
	}
	
}


function testForFiveFlipped(newMint) {

	// console.log(newMint);

	// short circuit
	if(!newMint) {

		var allCards = document.getElementsByClassName("flip-card");

		console.log(allCards);

		for (let card of allCards) {
		    console.log(card.classList);

		    let thisCardClassLength = card.classList.length;

		    // if classList contains only a single class, i.e. not flipped
		    if (thisCardClassLength === 1) {
		    	// not yet all flipped
		    	return false;
		    	break;
		    }

		    // if it gets here, all cards should be flipped.
		    console.log("Trigger 5 flipped animation to reveal NFT.");
		}

		return true;
	} else {
		// not a new mint, no need to test
		return false;
	}

}

// UI
function slideHandRight(this_hand) {
	this_hand.innerHTML = " >> ";
	this_hand.parentNode.classList.toggle('slide-right');
}


function foldThisHand(this_hand) {

	// first get the hand id number from the storage output
	console.log("HERE: ");
	console.log(this_hand.parentNode.innerHTML);

	let handId = this_hand.parentNode.innerHTML.slice(0,1);

	console.log(handId);

	foldHandDatabase(currentUserAddress, handId);

	// this_hand.parentNode.remove();

	foldHandBtn();
}


function foldHandDatabase(address, handNum, gameId) {

	// use a POST to a PHP file to assign fold to true in databse storage
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "query/fold-hand.php", true); 
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
	     // Response
	     var response = this.responseText;

	     console.log(response);
	     // contentArea.innerHTML += response;
	   }
	};
	var data = {address:address,gameId: activeGameNum,handNum: handNum};
	console.log(JSON.stringify(data));
	xhttp.send(JSON.stringify(data));
}


function buildHandDisplayMint(hand, index) {
		// console.log(hand);

		// This should grab the correct card images, and display below the card display output, with a subtle rotation animation loop.

		let intIndex = parseInt(index) + 1;

		let handOut = "<div class='hand'>" + intIndex + "#: ";
				handOut += "<a class='showOnSlide' onclick='foldThisHand(this)'>FOLD</a>";
				handOut += "<p class='pull-right' onclick='slideHandRight(this)'> << </p>";

		handOut += "<table><tr><td><div class='cardDisplay'>" + hand.card1.display  + "</div>" + assembleDisplayCard(hand.card1.id, false) + "</td>";
		handOut += "<td><div class='cardDisplay'>" + hand.card2.display + "</div>" + assembleDisplayCard(hand.card2.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card3.display + "</div>" + assembleDisplayCard(hand.card3.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card4.display + "</div>" + assembleDisplayCard(hand.card4.id, false) + "</td>"; 
		handOut += "<td><div class='cardDisplay'>" + hand.card5.display + "</div>" + assembleDisplayCard(hand.card5.id, false) + "</td>";
		// handOut += "<td><img src='img/400x400.png' alt ='NFT Image' style='border:2px solid black' /></td>";
		handOut += "</tr></table>";

		handOut += "</div>";


		// output to DOM
		return handOut;
}

function showThisNFT(clicked_link) {
	// get NFT IPFS URL and display in new window
	console.log(clicked_link);
}

function buildHandDisplayProfile(hand, index) {
		
		// console.log(hand);

		// This should grab the correct card images, and display below the card display output, with a subtle rotation animation loop.

		// profile indicates carrd flipped = true.

		let intIndex = parseInt(index) + 1;

		let nftLink = "img/img-test.svg";

		let handOut = "<div class='hand'>" + intIndex + "#: ";
				handOut += "<a class='showOnSlide' onclick='foldThisHand(this)'>FOLD</a>";
				handOut += "<br><a href="+nftLink+" target='_blank' class='showOnSlideToo' onclick='showThisNFT(this)'>NFT LINK</a>";
				handOut += "<p class='pull-right' onclick='slideHandRight(this)'> << </p>";

		handOut += "<table><tr><td><div class='cardDisplay shown'>" + hand.card1.display  + "</div>" + assembleDisplayCard(hand.card1.id, true) + "</td>";
		handOut += "<td><div class='cardDisplay shown'>" + hand.card2.display + "</div>" + assembleDisplayCard(hand.card2.id, true) + "</td>"; 
		handOut += "<td><div class='cardDisplay shown'>" + hand.card3.display + "</div>" + assembleDisplayCard(hand.card3.id, true) + "</td>"; 
		handOut += "<td><div class='cardDisplay shown'>" + hand.card4.display + "</div>" + assembleDisplayCard(hand.card4.id, true) + "</td>"; 
		handOut += "<td><div class='cardDisplay shown'>" + hand.card5.display + "</div>" + assembleDisplayCard(hand.card5.id, true) + "</td>";
		// handOut += "<td><img src='img/400x400.png' alt ='NFT Image' style='border:2px solid black' /></td>";
		handOut += "</tr></table>";

		handOut += "</div>";


		// output to DOM
		return handOut;
}



function editProfile() {
	// load the user's profile with editable fields for:
	// username
	// email
	// etc.

	// call to db to get username, email, etc.
	console.log("Edit Profile Here - TBD");

	contentArea.innerHTML = "<h3>Edit My Profile</h3>";
	// contentArea.innerHTML += "<h4>Edit Profile Here</h4>";

	getUserProfileData();

	// done
}

function gotoMyProfile(clicked_this) {

	console.log("TBD: remove active status for all menu items");
	removeActiveMenus();

	// handle the menu active status
	clicked_this.classList.toggle("active");

	// nav to page
	myProfile();
}

/** Page content - myProfile **/
function myProfile() {
	// console.log("Running myProfile");

	calculateUserBalance(activeGameNum);	// call with gameNum


	// reset content area
	contentArea.classList = "";
    contentArea.style.opacity = 1;

	var userProfileDemo = getUserProfile();
	let userTokens = userProfileDemo.tokens;
	// can we just get current user hand here and skip the cookie?
	// console.log(userProfileDemo);
	let userHands = userProfileDemo.hands;

	// console.log("Better to get tokens from: " + currentUserTokens);

	contentArea.innerHTML = "<h3>Dashboard - My Profile</h3>";
	contentArea.innerHTML += "<p>Address: <small><a title='Click here to edit your profile data' href='#' onclick='editProfile()'>"+userProfileDemo.address+"</a></small></p>";
	contentArea.innerHTML += "<p><strong>Hand Number: "+userProfileDemo.hands.length+" / 5(max)</strong> <span style='float: right;'>Tokens: "+userTokens+" </span></p><hr>";
	contentArea.innerHTML += "<h3>My Hands: </h3>";

	// demo hands output display for profile page
	// console.log(currentUserHands);

	currentUserHands.forEach( (hand, index) => {
		
		contentArea.innerHTML += buildHandDisplayProfile(hand, index);

	});

	// console.log(userHands, userHands.length);

	let testAmt = "0.00000001";

	if (userTokens < 1) {
		// then get some tokens to play the game
		contentArea.innerHTML += "<a class='btn btn-danger' onclick='addTokensPage()'><strong>Buy Some Tokens</strong></a>";
	} else {
		// then get some tokens to play the game
		contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";
		contentArea.innerHTML += "<a class='btn btn-outline-primary' onclick='sendTx("+testAmt+")'><strong>Test Tx</strong></a>";
	}

	contentArea.innerHTML += "<a class='btn btn-outline-danger' onclick='logOut();'>Log Out Wallet</a>";

	return true;
}

function logOut() {
	setCookie("isLoggedIn", false);
	setCookie("currentTokens", 0);
	setCookie("currentUserHands", [], -1);

	location.reload();
}

/** INTERNAL TOKEN MANAGEMENT FUNCTIONS **/

function handleBuyClick(selected) {
	buyNum = selected.value;
}


/** Page Content - addTokensPage **/
function addTokensPage() {

	// get current user
	var userProfileDemo = getUserProfile();

	console.log(userProfileDemo);

	//clear 
	contentArea.innerHTML = "";


	// if(isDemo) {
	// 	// UI 1-5 button interface, only needed for demo
	// 	contentArea.innerHTML = "<h3>How many tokens would you like to buy?</h3>";
	// 	contentArea.innerHTML += '<div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1" onClick="handleBuyClick(this)"><label class="form-check-label" for="inlineRadio1">1</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2" onClick="handleBuyClick(this)"><label class="form-check-label" for="inlineRadio2">2</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="3" onClick="handleBuyClick(this)"><label class="form-check-label" for="inlineRadio3">3</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="4" onClick="handleBuyClick(this)"><label class="form-check-label" for="inlineRadio4">4</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="5" onClick="handleBuyClick(this)"><label class="form-check-label" for="inlineRadio5">5</label></div>';
	// }

	getBuyinCost(activeGameNum);

}

// takes the number of plays and shows the user what they will pay for the next rebuy into the game
function outputBuyinCost(numPlays) {

	let eth_cost = Math.pow(10,numPlays) * 0.00000001;
	let cad_cost = eth_cost * 5000;

	console.log(currentUserHands);

	if(currentUserHands.length >= 5){
		// only can buy if not holding 5 hands
		contentArea.innerHTML += "Player has no space left, <a href='#' onclick='myProfile();'>discard some hands</a> first.";
	} else {

		// welcome and game number indicator

		contentArea.innerHTML += "<h2>Buy-In to game #: " + activeGameNum + "</h2>";

		console.log("Buy now buttons are generated here with labels for Buy-IN and re-Buy, numplays: " + numPlays);
		if(numPlays === 0 || numPlays === "0" || isDemo) {
			// if this is the first play, let the user know their buy-in for 5 tokens is free
			contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' onclick='userBuyNow(5, 0)'>First Buy In FREE!</a></div>";
		} else {
			// if this is a subsequent play
			contentArea.innerHTML += "<div class=text-center><a class='btn btn-success btn-lg' title='Approx cost $"+cad_cost+" CAD to rebuy.' onclick='userBuyNow(5, "+numPlays+")'>Rebuy #"+numPlays+" <br>("+eth_cost.toFixed(6)+" Ξ)</a><br>~$CAD "+cad_cost+"<br>Bankroll Total: $spent (this game)<br></div>";
		}
		// instructions area for clarity of puying process
		let instructions = "<hr><p><strong>What you get when buying in:</strong></p>";
		instructions += "<ul><li>Token Balance Refill to 5 (CP Tokens + Hands) <br>(you cannot hold more than 5 tokens or hands together)</li><li>One <strong>CP Hand NFT</strong> can be minted for each CP Token you hold.</li><li>The game receives fees based on the number of plays.</li><li>Rebuys <strong>increase 10x with each round</strong>, so plan your folds and rebuys carefully to get the most from your buys.</li><li>Pay attention to current game specs as each CP game can have specific proceeds allocations, prizing requirements and awards. DYOR.</li></ul>";

		/**  </li><li>Players with the best hands are rewarded with game profits to their connected wallet address.</li> **/

		contentArea.innerHTML += instructions;
	}
	
}

	

function userBuyNow(num,numPlays) {

	if(!isDemo){

		console.log(numPlays);

		if(numPlays > 0) {
			let eth_cost = Math.pow(10,numPlays) * 0.00000001;
			// this will require a rebuy cost too be tx and confirmed via metamask BEFORE sending the buy order
			console.log("tx detail - eth_cost: " + eth_cost + " | Address: " + currentUserAddress);

			sendTxAndBuy(eth_cost);

		} else if(numPlays > 10) {
			let eth_cost = 0.01;
			console.log("MAX BUY - eth_cost: " + eth_cost + " | Address: " + currentUserAddress);

			sendTxAndBuy(eth_cost);

		} else {
			// default call for first buyin
			buyTokensForEth(tokenMaxNum);
		}

		// moved inside transaction confrmation window.
		// buyTokensForEth(num);

		console.log("Need to trigger a send of currency as specified by eth_cost -> build a function and only trigger the function on successful database implementation of tokens tx for address.");

		// test function


	} else {
		// for demo mode buyin only
		// buyTokensForEth(tokenMaxNum);
		currentUserTokens = 5;
		tokenClaimSuccessOutput();
	}

	// calculateUserBalance(activeGameNum);	// call with gameNum
	// original legacy code below

	// console.log(currentUserTokens + num);

	if(currentUserTokens <= 5) {
		// add one or more tokens to global storage
		// currentUserTokens = currentUserTokens + num;
		setCookie("currentTokens", currentUserTokens);
		// add to current page
		contentArea.innerHTML = "<h3>Congrats, you got Token(s)</h3>";
		// contentArea.innerHTML += "<p>My Address: <small>"+userProfileDemo.address+"</small></p>";
		contentArea.innerHTML += "<p>My Tokens: "+currentUserTokens+"</p>";
		contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";
	} else {
		contentArea.innerHTML = "<h3>You already have too many Tokens to buy "+num+"</h3>";
		contentArea.innerHTML += "<a class='btn btn-primary' onclick='mintPage()'><strong>Let's Play!</strong></a>";
	}

	// final entry updates the UI content area
	UIloop();
}

/** NFT Minting functions **/
function gotoMint(clicked_this) {

	removeActiveMenus();

	// handle the menu active status
	clicked_this.classList.toggle("active");

	mintPage();
}

/** Page Content -> Mint Page **/
function mintPage() {

	// get current user
	var userProfileDemo = getUserProfile();

	console.log("Mint page is here");

	contentArea.innerHTML = "<hr><hr><p><strong>Welcome</strong> <small>"+userProfileDemo.address+"</small> to the DEAL/MINT Page.</p><p>Pressing the button below to trigger the Mint action will spend one of your CP tokens, issue theNFT to be minted to your address and reveal your hand for play (HODL) or fold (FODL).</p><p><strong>Be advised: Burning hands is a one way process and cannot be reversed.</strong> Choose wisely!</p><hr>";
	contentArea.innerHTML += "<p>My Tokens: "+userProfileDemo.tokens+"</p>";

	console.log(currentUserHands);

	if (currentUserHands.length >= 5) {
		console.log("Cannot mint more you have too many");
		contentArea.innerHTML += "Cannot mint more hands. <strong>You currently hodl the maximum number.</strong>.";
		contentArea.innerHTML += "<a class='btn btn-info' onclick='myProfile()'><strong>DISCARD</strong></a>";
	} else if (userProfileDemo.tokens > 0) {
		contentArea.innerHTML += "<div class=text-center><a id='bigDeal' class='btn btn-lg btn-outline-primary' onclick='mintAction()'><strong>DEAL</strong></a><br>(Deal Animation)</div>";
	} else {
		contentArea.innerHTML += "<a class='btn btn-danger' onclick='addTokensPage()'><strong>BUY IN</strong></a>";
	}

}

function buildDeck() {
	var deck = [
        {id: 1, display: "A♠️", value: 1, suit: "spades", ipfs_cid:"bafybeicm6dqkpiop65z6i2peua54chs3bk7snakajwecre4oixsmswfwym"},
        {id: 2, display: "2♠️", value: 2, suit: "spades", ipfs_cid:"bafybeicbh7ha56qzjc2yfrmnwhi6sy4xaougfccthyayiij3rkma3ycgte"},
        {id: 3, display: "3♠️", value: 3, suit: "spades", ipfs_cid:"bafybeif64xmkdw37g3j3hbgbk6zjr652tbfnomenspn4qs2ghckvqhywsa"},
        {id: 4, display: "4♠️", value: 4, suit: "spades", ipfs_cid:"bafybeibnkq7djhqw5dp67peds6jidp3dvjdxmzkucaap3y5fhqpkpchkla"},
        {id: 5, display: "5♠️", value: 5, suit: "spades", ipfs_cid:"bafybeifabkwl35c7vjkk32zypzaf3mah7eakuk3zw36u7an7yxkmmygveq"},
        {id: 6, display: "6♠️", value: 6, suit: "spades", ipfs_cid:"bafybeiccv32yxyi75cmyu3lyggpkul6gyedddv3q3o3mxmqa4qlvoclnfu"},
        {id: 7, display: "7♠️", value: 7, suit: "spades", ipfs_cid:"bafybeiasu3edvhxjjnw65r3jrrvjessmt5pkf33ytivl2tc5jrncy37eiq"},
        {id: 8, display: "8♠️", value: 8, suit: "spades", ipfs_cid:"bafybeibdiuodmblfk4ecnk6o3n2hltfg2j6nwvu6uzdby7docx22rcdd3q"},
        {id: 9, display: "9♠️", value: 9, suit: "spades", ipfs_cid:"bafybeidpsqiaxnxpgockpht7ecqaeu5pb33uwca5gbodalcdihb66fyqyy"},
        {id: 10, display: "10♠️", value: 10, suit: "spades", ipfs_cid:"bafybeihwnp5lbmh7hxlayygx6hl7av54dcdblbatyqblddycgtmflkya2a"},
        {id: 11, display: "J♠️", value: 11, suit: "spades", ipfs_cid:"bafybeidvz3a5y55rxwcstuvys7b4g56hnrcfnmp7qdfvinwl4nde6wztja"},
        {id: 12, display: "Q♠️", value: 12, suit: "spades", ipfs_cid:"bafybeic2bp2uohmqsbs3aa3sqn5olkdj43pf6g4nkc7jejfm6h74udh6gq"},
        {id: 13, display: "K♠️", value: 13, suit: "spades", ipfs_cid:"bafybeibckznpp76427qsd4hf74epva445fmuloeid4jicttrgdcgkj2pmy"},
        {id: 14, display: "A♥️", value: 1, suit: "hearts", ipfs_cid:"bafybeicc5ppnndblirjsvszgqbnj2cuakoladvrbdwz7dsdi47z4kcssl4"},
        {id: 15, display: "2♥️", value: 2, suit: "hearts", ipfs_cid:"bafybeie7lbe7piavel4celocm4nitytkjdb4c4j6b2qvgpl2xph2up22ty"},
        {id: 16, display: "3♥️", value: 3, suit: "hearts", ipfs_cid:"bafybeidlhzopv5di4i4j5pu7sh5i7hrjxmafxyrrjhaway73ebyg5qcuxu"},
        {id: 17, display: "4♥️", value: 4, suit: "hearts", ipfs_cid:"bafybeigo5ng5z7rur6godmnyehbbwzpciy7gatefaavomyxhojxxnlj4qe"},
        {id: 18, display: "5♥️", value: 5, suit: "hearts", ipfs_cid:"bafybeigtyxk6bsok6y7bva4rbjblghvrarb5bjpu7mrelklmwdhvcagihm"},
        {id: 19, display: "6♥️", value: 6, suit: "hearts", ipfs_cid:"bafybeif3nrxgwmr4cxzayvv5q5wcvkoj2zkr7fhvgfxbiceg3ge7nctxq4"},
        {id: 20, display: "7♥️", value: 7, suit: "hearts", ipfs_cid:"bafybeiatbyhy2jkssj7gfq5brfc2fklvkctewwmzaozuzktmu6nr57kxsi"},
        {id: 21, display: "8♥️", value: 8, suit: "hearts", ipfs_cid:"bafybeichdgpmuzhvcalw7c3cng5hyiapl33l3mnfn5a7aien6h5n2kbwxe"},
        {id: 22, display: "9♥️", value: 9, suit: "hearts", ipfs_cid:"bafybeicd6gb4c267tfebbunv7gjh2sr5syui4z5y6iheofu7wunzeplh64"},
        {id: 23, display: "10♥️", value: 10, suit: "hearts", ipfs_cid:"bafybeihgkio5we23api2q6soldkjecu4qx6jc7lh7tmxoakpdjcho3g4p4"},
        {id: 24, display: "J♥️", value: 11, suit: "hearts", ipfs_cid:"bafybeighdsvapdmvxkzgaqxmbsyi426oh6hx2kyh5jwumly7pldznudetm"},
        {id: 25, display: "Q♥️", value: 12, suit: "hearts", ipfs_cid:"bafybeihvuvbvozmsl5ynyyby5jbt7ftlpbep3niiek7fww5xiwtdibnjbm"},
        {id: 26, display: "K♥️", value: 13, suit: "hearts", ipfs_cid:"bafybeie5hsefyfvdwda6ybs5laaqvtq6iay4kwtqe4zlthh74hznaiqb7i"},
        {id: 27, display: "A♦️", value: 1, suit: "diamonds", ipfs_cid:"bafybeidyyl5je3sssgu2cqtbfsiudu3uphgzwsavtjgdlum4vhuifh26bm"},
        {id: 28, display: "2♦️", value: 2, suit: "diamonds", ipfs_cid:"bafybeidwksaegho7jlexc4rlnzqkppk6vl4nt5bwxta3a2ek6mvwevhrdy"},
        {id: 29, display: "3♦️", value: 3, suit: "diamonds", ipfs_cid:"bafybeieyvtgq2j3ulbf6elt2z5d7exuzwfekekjntrkj7jchnwddpd5n4i"},
        {id: 30, display: "4♦️", value: 4, suit: "diamonds", ipfs_cid:"bafybeibgfzlbwtmjgjaftorge5oigvut3wfcre3yv7hg6sbkuhpfk76udi"},
        {id: 31, display: "5♦️", value: 5, suit: "diamonds", ipfs_cid:"bafybeigxbtmrtpvjercmh72smnfruiht7vvjqs2brbavifmxpe6j73jtk4"},
        {id: 32, display: "6♦️", value: 6, suit: "diamonds", ipfs_cid:"bafybeidpswgtgldpydipzf7d6h7eyeouazbazqumtwzueeoucke3chtu5y"},
        {id: 33, display: "7♦️", value: 7, suit: "diamonds", ipfs_cid:"bafybeicixdgug5kbyx74taqwabv5i33vtxqvywsxcyhin6xgc4afhoaiuu"},
        {id: 34, display: "8♦️", value: 8, suit: "diamonds", ipfs_cid:"bafybeic2cwfv3iv3d7jazyc44kzn5kzsc3pyhpkabqxpyiqdbapmc322bu"},
        {id: 35, display: "9♦️", value: 9, suit: "diamonds", ipfs_cid:"bafybeickwbzgnerdryvsmbnsrc6w7kgicporfa62k2hgrlbb43hqy4avgi"},
        {id: 36, display: "10♦️", value: 10, suit: "diamonds", ipfs_cid:"bafybeih6vf6e3e6efv5omyygbbbs6hukyb7ixnzx76eljliqutl5q4gkve"},
        {id: 37, display: "J♦️", value: 11, suit: "diamonds", ipfs_cid:"bafybeibk7tk5o5mycksi7b7o2zgarbgkphbr2yxj3vj277n7uc5cakdxtq"},
        {id: 38, display: "Q♦️", value: 12, suit: "diamonds", ipfs_cid:"bafybeiczvslukdwq2eprqp5qnvfycuxco5yfiu4pe2v26ckdbuypkqmtyi"},
        {id: 39, display: "K♦️", value: 13, suit: "diamonds", ipfs_cid:"bafybeidyh3qsd7qwshuyhy23l2j7r5shaak6ckvwgretthscx4ytwfut5m"},
        {id: 40, display: "A♣️", value: 1, suit: "clubs", ipfs_cid:"bafybeicsl4ey6tyqm4sshs7aappbdpdx4s3mgpuhg4pf6lhg2ry5i6fypm"},
        {id: 41, display: "2♣️", value: 2, suit: "clubs", ipfs_cid:"bafybeihhj3yxezzc5in7pu5gbeklrazgcse2ingafbf6xgqwedsvzhxgcy"},
        {id: 42, display: "3♣️", value: 3, suit: "clubs", ipfs_cid:"bafybeied5qgvk3y5al7rtu4w6jbrkbathd44jya4hg5fgsjn2m7g2hfchm"},
        {id: 43, display: "4♣️", value: 4, suit: "clubs", ipfs_cid:"bafybeih32qnsk5z3esn7r35wuk3fc5hosbwhtlefcz5jeiig7ji4p654yy"},
        {id: 44, display: "5♣️", value: 5, suit: "clubs", ipfs_cid:"bafybeihgi6owbc64x2zjack2u2e2ynre5kbtzh2odvkhv3cjhbnxy5tkry"},
        {id: 45, display: "6♣️", value: 6, suit: "clubs", ipfs_cid:"bafybeibu45oij4wlktc4rczhjifmtref3kpsmja5ay46f5jinri7almety"},
        {id: 46, display: "7♣️", value: 7, suit: "clubs", ipfs_cid:"bafybeicam667cpvax3lxofmlcp5cp5hzdr2lut4mx3mp4h563zpneqkv5e"},
        {id: 47, display: "8♣️", value: 8, suit: "clubs", ipfs_cid:"bafybeie4bvib3pgycc4me2efapmnovcuwentlahuyfu3nytnnggelfx4ny"},
        {id: 48, display: "9♣️", value: 9, suit: "clubs", ipfs_cid:"bafybeig2qwartbxtv5ocb5s7cbkeywbev6qryj5udoaxeof6ykiaht4d24"},
        {id: 49, display: "10♣️", value: 10, suit: "clubs", ipfs_cid:"bafybeif5ajwe6nkbvvo4lxiievscg4gt65rd7ud5fmw2psre2hsigoxwq4"},
        {id: 50, display: "J♣️", value: 11, suit: "clubs", ipfs_cid:"bafybeia2ah36lsvgilaal24wv4j22n2ccwhbftpokrqgt3kofairxclzga"},
        {id: 51, display: "Q♣️", value: 12, suit: "clubs", ipfs_cid:"bafybeiewpnsl2lndtm7y3drqzlz6bv3n6jdd7fvlgnfuf4wjlqtle7wue4"},
        {id: 52, display: "K♣️", value: 13, suit: "clubs", ipfs_cid:"bafybeid6a6vngp2h4ucvaoqpvyshn7nz3o7oce3qv4lc3q6vw7kcinwpvm"}
    ];

	return deck;
}

function getASampleHand(currentHandCount) {

	var sampleHand = {};

	// generate a hand at random from a new deck
		// get a new deck
		var deckDeal = buildDeck();
		// console.log(deckDeal);

		// card 1
		let c1 = Math.floor(Math.random() * deckDeal.length);
		// console.log(c1);
		let card1 = deckDeal[c1-1];
		console.log(card1);

		deckDeal = deckDeal.filter(function(item) {
    		return item.id !== c1
		});

		// console.log(deckDeal); 

		// card 2
		let c2 = Math.floor(Math.random() * deckDeal.length);
		let card2 = deckDeal[c2-1];
		console.log(card2);
		deckDeal = deckDeal.filter(function(item, index) {
    		return index !== c2-1;
		});

		// console.log(deckDeal);

		// card 3
		let c3 = Math.floor(Math.random() * deckDeal.length);
		let card3 = deckDeal[c3-1];
		console.log(card3);
		deckDeal = deckDeal.filter(function(item, index) {
    		return index !== c3-1;
		});

		// console.log(deckDeal);

		// card 4
		let c4 = Math.floor(Math.random() * deckDeal.length);
		let card4 = deckDeal[c4-1];
		console.log(card4);
		deckDeal = deckDeal.filter(function(item, index) {
    		return index !== c4-1;
		});

		// console.log(deckDeal);

		// card 5
		let c5 = Math.floor(Math.random() * deckDeal.length);
		let card5 = deckDeal[c5-1];
		console.log(card5);
		deckDeal = deckDeal.filter(function(item, index) {
    		return index !== c5-1;
		});

		// console.log(deckDeal);

		// END TEST AREA

	if(currentHandCount === 0 && isDemo) {
		sampleHand = {
			card1: { display: "A♠️", value: 1, suit: "spades", id: 1 },
			card2: { display: "A♥️", value: 1, suit: "hearts", id: 14 },
			card3: { display: "A♦️", value: 1, suit: "diamonds", id: 27 },
			card4: { display: "A♣️", value: 1, suit: "clubs", id: 40 },
			card5: { display: "2♣️", value: 2, suit: "spades", id: 41 }
		}
	} else if (currentHandCount === 1 && isDemo) {
		sampleHand = {
			card1: { display: "3♠️", value: 3, suit: "spades", id: 17 },
			card2: { display: "4♥️", value: 4, suit: "hearts", id: 22 },
			card3: { display: "5♦️", value: 5, suit: "diamonds", id: 31 },
			card4: { display: "6♣️", value: 6, suit: "clubs", id: 45 },
			card5: { display: "2♣️", value: 2, suit: "spades", id: 41 }
		}
	} else {

		sampleHand = {
			card1: card1,
			card2: card2,
			card3: card3,
			card4: card4,
			card5: card5
		}
		// location.reload();
		// generate a hand at random from a new deck
		// var deckDeal = buildDeck();
		// console.log(deckDeal);

		// let c1 = Math.floor(Math.random() * deckDeal.length);
		// console.log(c1);

		// // const array = [2, 5, 9];

		// // console.log(array);

		// const index = deckDeal.indexOf(c1);
		// if (index > -1) {
		//   deckDeal.splice(index, 1);
		// }

		// // array = [2, 9]
		// console.log(deckDeal); 
	}

	return sampleHand;
}


function buildSvg(hand) {

	console.log("Can we find a way to add mint number to the hand storage object?");
	console.log(hand);

	let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';

	mySvg += '<rect width="100%" height="100%" fill="#3d3838" /><text x="10" y="25" class="title">CRYPTOPOKER HAND #: 1337 / 10,000</text><text x="260" y="45" class="base small">gameId #: 00'+activeGameNum+'</text><text x="10" y="60" class="base">';
	mySvg += 'Card 1: ' + hand.card1.display + '</text><text x="10" y="80" class="base">Card 2: ' + hand.card2.display + '</text><text x="10" y="100" class="base">Card 3: ' + hand.card3.display + '</text><text x="10" y="120" class="base">Card 4: ' + hand.card4.display + '</text><text x="10" y="140" class="base">Card 5: ' + hand.card5.display + '</text><text x="10" y="180" class="alert">';
	// TO DO
	mySvg += 'MOCK: So Lucky! Hand Rank Probability: 0.02401%</text><text x="10" y="200" class="alert heavy">You got a four of a kind! Hand value: Ace</text><text x="10" y="220" class="base small">Join us at https://justplay.cafe/ to play your hand.</text>';

	mySvg += '<image x="270" y="240" href="https://'+hand.card1.ipfs_cid+'.ipfs.dweb.link" height="100" transform="rotate(11, 290, 270)" />';
	mySvg += '<image x="210" y="240" href="https://'+hand.card2.ipfs_cid+'.ipfs.dweb.link" height="100" transform="rotate(-10, 240, 250)" />';
	mySvg += '<image x="150" y="240" href="https://'+hand.card3.ipfs_cid+'.ipfs.dweb.link" height="100" transform="rotate(5, 165, 260)" />';
	mySvg += '<image x="90" y="240" href="https://'+hand.card4.ipfs_cid+'.ipfs.dweb.link" height="100" transform="rotate(-8, 100, 250)" />';
	mySvg += '<image x="30" y="240" href="https://'+hand.card5.ipfs_cid+'.ipfs.dweb.link" height="100" transform="rotate(9, 40, 270)" />';
	mySvg += '</svg>';

	//save to ipfs
	// saveMintIpfs(currentUserAddress, mySvg);

	console.log("TBD HERE SAVE SVG WORKS, But need to resolve module issue");

	// call it
	// storeImageData(mySvg).then(function(result) {
	// 	console.log(result);
	// });

	return mySvg;
}


function mintAction() {
	console.log("Mint Action is here");

	let currentHandCount = currentUserHands.length;
	let sampleHand = getASampleHand(currentHandCount);


	// add hand to current user hands list (this will need a hold/burn confimration first)
	currentUserHands.push(sampleHand);

	let handNow = currentUserHands[currentUserHands.length-1];
	let storeHandNow = [handNow.card1.id, handNow.card2.id, handNow.card3.id, handNow.card4.id, handNow.card5.id];

	// redundant? to be superceded by database storage
	console.log("DEPRECIATED: Working here on cookie storage for current hands. ");

	// generate a simple int array to store the hands
	console.log(currentUserHands);
	let hand1 = currentUserHands[0];
	let storeHand1 = [hand1.card1.id, hand1.card2.id, hand1.card3.id, hand1.card4.id, hand1.card5.id];

	setCookie("currentUserHands", [storeHand1] );

	// NEW FUNCTION FOR DATABASE STORAGE TEST
	if(!isDemo) {
		//	no db storage for demo user
		console.log("This new function is in testing here for database addition to minting function.");
		saveMint(1, [storeHandNow], buildSvg(handNow));

		console.log("Remove one token from current user balance - db - maybe call from saveMint?");
		spendOneToken();


	} else {
		console.log("Data storage is disabled for demo mode.")
	}


	if ( currentUserHands.length > currentHandCount ) {
		// then one was successfully added, spend 1 token

		

		currentUserTokens--;
		setCookie("currentTokens", currentUserTokens);
		UIloop();
	}


	var mainAlert = "<div class='alert alert-success' role='alert'><h4 class='alert-heading'>Hand Minted Successfully!</h4>  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' class='bi bi-exclamation-triangle-fill flex-shrink-0 me-2' viewBox='0 0 16 16' role='img' aria-label='Warning:'><path d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'/></svg><p>This is an important mesage on how to reveal your NFT. First, click on each of the cards that you received in our hand to reveal them. Then your NFT will be revealed, and you will be given the option to play or fold your hand.</p><hr><p class='mb-0'>Choose wisely! Each player's wallet can only contain 5 hands at one time. Good luck!</p><button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></div>";

	contentArea.innerHTML = mainAlert;

	console.log("Need to get mintNum from storage, or ipfs link to nft...");
	let mintNum = "30";

	// contentArea.innerHTML += "<img id='nft-img' class='image-wide nft-img' src='img/img-test.svg' alt='NFT, or animated gif of NFT hand generation' />";
	contentArea.innerHTML += "<img id='nft-img' class='image-wide nft-img' src='img/mint/"+activeGameNum+"-"+currentUserAddress+".svg' alt='NFT, or animated gif of NFT hand generation' />";
	contentArea.innerHTML += "<p><a href='img/mint/"+activeGameNum+"-"+currentUserAddress+".svg' target='_blank'>Just show me my NFT!</a></p>"

	// console.log("SVG ON THE FLY -> DEBUG HERE");
	// let mySVG = generateSVGonTheFly();
	// console.log(mySVG);
	// console.log(currentUserHands);

	// contentArea.innerHTML += "<img class='image-wide' src='"+mySVG+"' alt='NFT, or animated gif of NFT hand generation' />";


	// console.log("Maybe this should just display the one hand minted, with the *one time offer* buttons.");

	//  for (var i = currentUserHands.length - 1; i >= 0; i--) {

	let mintIndex = currentUserHands.length-1;
	
	// console.log("These should NOT be displayed pre-flipped");
	contentArea.innerHTML += buildHandDisplayMint(currentUserHands[mintIndex], mintIndex);

		// conditional display for last (current) mint
		// if(i === currentUserHands.length - 1) {
			// don't show hand assessemnt -> instead allow for it to be revealed with the NFT display
			// contentArea.innerHTML += assessHand(currentUserHands[i]);
			// contentArea.innerHTML += "<hr>";
	contentArea.innerHTML += "<div class='button-container row'><div class='col'><a id='playHand' class='btn btn-outline-success btn-lg' title='Hold this hand and move it to your dashboard.' onclick='playHandBtn();'>HODL</a></div><div class='col'><a id='foldHand' title='Fold ths hand and burn it forever' class='btn btn-outline-danger btn-lg disabled' onclick='foldHandBtn();'>FODL</a></div></div>";
			// contentArea.innerHTML += "<hr>";
		// } else {
	// contentArea.innerHTML += "<hr>";
		// }
	

	// }

	// init new buttons
	// document.getElementById("playHand").addEventListener("click", playHandBtn);
	// document.getElementById("foldHand").addEventListener("click", foldHandBtn);
	
}


// DEPRECIATED -> function to generate the svg file on the fly, and save to disk
function generateSVGonTheFly() {
	// create the svg element
    const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // set width and height
    svg1.setAttribute("width", "100");
    svg1.setAttribute("height", "100");

    // create a circle
    const cir1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    cir1.setAttribute("cx", "80");
    cir1.setAttribute("cy", "80");
    cir1.setAttribute("r", "30");
    cir1.setAttribute("fill", "red");

    // attach it to the container
    svg1.appendChild(cir1);

    // attach container to document
    // return svg1;
    console.log(svg1);

    let mySvg = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">';
    mySvg += '<style>.base { fill: white; font-family: sans-serif; font-size: 14px; } .title { font-size: 18px; font-weight:bold; fill: #F47A1F; font-family: sans-serif; } .alert{ text-decoration:underline; fill: #E6C65B; } .small{ font-size: 12px;} .heavy{ font: italic 20px serif;}</style>';
    mySvg += '<rect width="100%" height="100%" fill="#3d3838" />';
    mySvg += '<text x="10" y="25" class="title">';
    mySvg += '	CRYPTOPOKER HAND #: 1337 / 10,000';
    mySvg += '</text><text x="260" y="45" class="base small">';
    mySvg += '	gameId #: 001';
    mySvg += '</text><text x="10" y="60" class="base">';
    mySvg += '	Card 1: A♠️';
    mySvg += '</text><text x="10" y="80" class="base">';
    mySvg += '</text></svg>';

    return mySvg;
}

// interact with minted hand

function playHandBtn() {
	console.log("PLAYING HAND -> add *NFT* to wallet, register hand in global game db as PLAY");

	let airplaneHtml = '<div id="plane-container"><div class="paperplane"><div class="plane"><div class="wingRight"></div><div class="wingLeft"></div><div class="bottom"></div><div class="top"></div><div class="middle"></div></div><div class="clouds"><div class="cloudOne"></div><div class="cloudTwo"></div><div class="cloudThree"></div></div></div></div>';

	console.log("Fancy animation -> flying to the right, then send player to their profile page (later scoreboard?)");

	contentArea.innerHTML = airplaneHtml;

	// delay to show off the animation, then redirect
	setTimeout(() => {console.log("executing redirection after 2.5 seconds"); myProfile(); }, 2500);	

	return true;
}

function foldHandBtn() {
	console.log("FOLDING HAND -> burn *NFT* to 0x0, register hand in global game db as FOLD");

		console.log("Fancy animation -> burning animation, 8s countdown then explode");

		// first add and style the flame
		contentArea.innerHTML += "<div class='burn-container'><div class='flame'></div></div>";

		// countdown and add class explode 
		var fade= document.getElementById("contentArea");
      // animation
    var intervalID = setInterval(function () {
          
        if (!fade.style.opacity) {
            fade.style.opacity = 1;
        }
          
          
        if (fade.style.opacity > 0) {
            fade.style.opacity -= 0.033;

            if(fade.style.opacity < 0.7) {
            	// light the fuse
	            fade.classList = "explode";
  					} 

  					if (fade.style.opacity < 0.5) {
  						// bail
  						clearInterval(intervalID);

  						// fade.style.transform: scale(3) rotate(10deg);
  						// myProfile();
  						location.reload();
  					}

        } else {
            clearInterval(intervalID);
        }
          
    }, 200);

		// handle the actual removal of the hand from storage
		console.log("NEEDFIX ->Either refresh UI, or remove the correct one from the array list");
		currentUserHands.pop();

		// LATER: will need to sync this to the DB /chain
		




	return true;
}

function burnAction() {
	contentArea.innerHTML += "TBD: Display a list of current hands and burnable with an X";
	contentArea.innerHTML += "<br><strong>Will require confimration.</strong>";
}

// hand value testing

function straightTest(values) {
	if(
		1+values[0] === values[1] &&
		1+values[1] === values[2] &&
		1+values[2] === values[3] &&
		1+values[3] === values[4] 
		) {
		return true;
	}

	return false;
}

function assessHand(hand) {

	var outputString = "this will return a string based on the hand analysis";

	console.log(hand.card1.display, hand.card1.suit);

	// need a way to easily compare cards -> the logical choice is nested objects.

	// *********************************************************** /
	// MULTIPLES
	// *********************************************************** /

	if(hand.card1.value === hand.card2.value) {
		// more values needed
		outputString = "You got a pair!";
	}  

	if(hand.card1.value === hand.card2.value && hand.card1.value === hand.card3.value) {
		outputString = "You got a three of a kind!";
	}

	// determine for 4 of a kind!
	if(
		(hand.card1.value === hand.card2.value && 
		hand.card3.value === hand.card4.value && 
		hand.card3.value === hand.card2.value )
		||
		(hand.card1.value === hand.card2.value && 
		hand.card3.value === hand.card5.value && 
		hand.card3.value === hand.card2.value )
		||
		(hand.card1.value === hand.card2.value && 
		hand.card2.value === hand.card5.value && 
		hand.card2.value === hand.card4.value )
		||
		(hand.card1.value === hand.card3.value && 
		hand.card3.value === hand.card5.value && 
		hand.card1.value === hand.card4.value )
		||
		(hand.card3.value === hand.card2.value && 
		hand.card3.value === hand.card4.value && 
		hand.card3.value === hand.card5.value )
		) {
		outputString = "So Lucky! <strong>0.02401% Probability</strong>. You got a four of a kind! ";

		if(hand.card2.value === 1) {
			outputString += "Hand value: Ace";
		} 
	}

	// *********************************************************** /
	// STRAIGHT
	// *********************************************************** /

	// get all the card values as an array for easy sorting
	let valueArray = [hand.card1.value, hand.card2.value, hand.card3.value, hand.card4.value, hand.card5.value];
	valueArray.sort();
	console.log(valueArray);

	let isStraight = straightTest(valueArray);

	console.log(isStraight);

	if(isStraight) {
		outputString = "Lucky! <strong>0.3925% Probability</strong>. You got a straight with "+valueArray[4]+" high! ";
	}

	return outputString;
}

function removeActiveMenus() {
	let allMenus = document.getElementsByClassName('nav-link');

	Array.from(allMenus).forEach(element => {

		console.log(element);
		// reset classList to basic
		element.classList = 'nav-link';

		// buildHandFromStoredData(element);

	});
}

function gotoScoreboard(this_link) {

	removeActiveMenus();

	console.log(this_link);
	this_link.classList.toggle("active");
	// refresh game data

	// open score board page
	scoreboard();
}

function printScoreboardData(gameData) {

	console.log(gameData);

	let endTime = gameData.end_time;
	let cptokenTreasury = parseInt(gameData.cptoken_treasury) - parseInt(gameData.token_sold);
	let ethTreasury = gameData.eth_treasury;

	let tokenTotal = gameData.token_total;	// in play, not minted
	let tokenSold = gameData.token_sold;	// total out from treasury
	let tokenSpend = gameData.token_spend;	// total number minted

	// adjust for demo wallet credits (5)
	tokenTotal -= 5;
	tokenSold -= 5; 

	let activePlayers = gameData.unique_addr;
	let total = gameData.total_hands;
	let in_play = gameData.hands_in_play;
	// calculated
	let fold = gameData.total_hands - gameData.hands_in_play;

	contentArea.innerHTML += "<h2>Game: 00"+activeGameNum+" <br/><small>ends: "+endTime+"</small></h2>";
	contentArea.innerHTML += "<p><strong>CP Token Treasury:</strong> "+cptokenTreasury+" <br><strong>ETH Treasury:</strong> "+ethTreasury+"</p>";
	contentArea.innerHTML += "<p>CP Tokens Claimed: "+tokenSold+" <br>CP Hands Minted: "+tokenSpend+" <br>Tokens Outstanding: "+tokenTotal+"</p>";
	contentArea.innerHTML += "<small><a href='#'>Select another game</a></small>";
	contentArea.innerHTML += "<h4>Number of players: "+activePlayers+"</h4>";
	contentArea.innerHTML += "<h4>Hands Currently in play: "+in_play+"</h4>";
	contentArea.innerHTML += "<h4>Hands Removed from play: "+fold+"</h4>";
	contentArea.innerHTML += "<h3>The Game: "+total+" / 10,000</h3><hr>";

}

function scoreboard() {

	// clear existing data
	contentArea.innerHTML = "";

	getGameInfo(activeGameNum, true);		// generates JSON GameData & Calls print ScoreboardData function, true for scoreboard output

	// user specific data
	contentArea.innerHTML += "<p>--- TBD Specific User Data Here PLACEHOLDER ---</p>";
	contentArea.innerHTML += "<p><strong>My Hands (cumulative rarity score):</strong> <br>100 + 100 + 200 + TBD + TBD = 400</p>";
	contentArea.innerHTML += "<p><strong>Top Hand:</strong> <i>1 in 215,000</i> So Rare!</p>";
	contentArea.innerHTML += "<p>--- General Game Data Here ---</p>";

}

// blockchain simulator functions 

function getUserProfile() {
	// get the user profile from connected wallet and store as object, 

	if(currentUserAddress === "") {
		// set a temporary address for use
		currentUserAddress = "0xPLEASE_CONNECT_WALLET";
	}


	// for example -> build the user profile from the interally generated and stored variables.
	var userProfile = {
		tokens: currentUserTokens,		// is int
		address: currentUserAddress,		// is string
		hands: currentUserHands			// should be an array of arrays
	}

	return userProfile;
}





