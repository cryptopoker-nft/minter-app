<?php

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

// the only thing we need here is game number to pull the following data:
// number of hands in play:
// total number of hands (folded will be the subtraction)
// number of unique addresses in play:

$gamenum = $data->gameNum;
$address = $data->address;
// $numTokens = $data->numTokens;		// this should always be 5

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');



// get play number for current game

// $qry_total_hands = "SELECT * FROM allhands WHERE gameId='$gamenum'";

// if($result = $conn->query($qry_total_hands)) {

// 	// echo "YEP ";
// 	$hand_total = 0;	// init to 0
// 	$hand_total = $result->num_rows;

// }


// to determine number of tokens to remove from main treasury and add to account ownership
// lookup current balance that user has by HANDS_IN_PLAY 
// -> token balance must be 0 in order for user to get here
// $cp_token_change = numTokens - HANDS_IN_PLAY

// $qry_player_hands_in_play = "SELECT * FROM allhands WHERE gameId='$gamenum' AND address='$address' AND fold='false'";

// // init
// $hand_total = 0;

// if($result = $conn->query($qry_player_hands_in_play)) {

// 	// echo "YEP ";
// 	// rows indicate distinct records of hands in play for this address
// 	$hand_total = $result->num_rows;

// }

// $cp_token_change = $numTokens - $hand_total

// to determine cost of buy-in or re-buy, lookup user number of buys in userAccounts->playnum
// $eth_change = ($playnum * 10) * 0.00000001;

$qry_playnum = "SELECT * FROM token_treasury WHERE address='$address' AND gameId='$gamenum'";
// init var for default 0
$playnum = 0;

if($result = $conn->query($qry_playnum)) {

	while ($row = $result->fetch_assoc()) {

  		// $token_total = $token_total + $row["cp_token"];
  		$cp_token_delta = $row["cp_token"];

	  	if($cp_token_delta > 0) {
	  		// it's a buy or rebuy (positive)
	  		$playnum++;
	  	} else {
	  		// it's a record of a token spend (will be negative)
	  		
	  	}

    }

}

// echo $playnum;

// echo "GameNum: $gamenum | tx for address: $address ADD output: playnum: $playnum";
echo $playnum;


// $eth_change = ($playnum * 10) * 0.000001;


// tx data storage
// $table = 'token_treasury';
// $cp_token_change = $numTokens;
// $eth_change = 0;

// conditional hand "cost" -> (credit eth) based on which 1000 hands we are in.
// EVENTUALLY THIS WILL BE HANDLED AT THE TOKEN BUY POINT, NOT THE TOKEN SPEND POINT
// if ($hand_total < 2000) { $eth_change = 0; } else 
// if ($hand_total >= 2000 && $hand_total < 3000) { $eth_change = 0.0000001; } else 
// if ($hand_total >= 3000 && $hand_total < 4000) { $eth_change = 0.000001; } else
// if ($hand_total >= 4000 && $hand_total < 5000) { $eth_change = 0.00001; } else 
// if ($hand_total >= 5000 && $hand_total < 6000) { $eth_change = 0.0001; } else  
// if ($hand_total >= 6000 && $hand_total < 7000) { $eth_change = 0.001; } else 
// if ($hand_total >= 7000 && $hand_total < 8000) { $eth_change = 0.01; } else 
// if ($hand_total >= 8000 && $hand_total < 9990) { $eth_change = 0.1; } else { $eth_change = 0.5; }

// $qry = "INSERT INTO $table(address, gameId, handString) VALUES ('0xTHISISANADDRESSSTORAGESPOT', 1, '2,5,6,3,45')";
// $qry = "INSERT INTO $table(address, gameId, cp_token, eth_token) VALUES ('$address', $gamenum, $cp_token_change, $eth_change)";


// if ($conn->query($qry) === TRUE) {
//     echo "New record created successfully";
// } else {
//     echo "Error: " . $qry . "<br>" . $conn->error;
// }

$conn->close();

// echo "Success";
        
    
?>
