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
$numTokens = $data->numTokens;		// this should always be 5
$ethCost = $data->ethCost;

// echo "GameNum: $gamenum | tx for address: $address ADD $numTokens";

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');



// get play number for current game

$qry_total_hands = "SELECT * FROM allhands WHERE gameId='$gamenum'";

if($result = $conn->query($qry_total_hands)) {

	// echo "YEP ";
	$hand_total = 0;	// init to 0
	$hand_total = $result->num_rows;

}


// to determine number of tokens to remove from main treasury and add to account ownership
// lookup current balance that user has by HANDS_IN_PLAY 
// -> token balance must be 0 in order for user to get here
// $cp_token_change = numTokens - HANDS_IN_PLAY

$qry_player_hands_in_play = "SELECT * FROM allhands WHERE gameId='$gamenum' AND address='$address' AND fold='false'";

// init
$hand_total = 0;

if($result = $conn->query($qry_player_hands_in_play)) {

	// echo "YEP ";
	// rows indicate distinct records of hands in play for this address
	$hand_total = $result->num_rows;

}
/********************* WARNING *************************/
/** If USER with non-zero balance is able to get here, this DOES NOT YET test for current token balance when calculating change **/
$cp_token_change = $numTokens - $hand_total;

/***************** END WARN **************************/

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

$default_fees = 0.00001;		// in MATIC for Polygon live deployment

$eth_change = pow(10, $playnum) * $default_fees;

$userTable = "userAccounts";
$set_play_num = "UPDATE $userTable SET playnum=$playnum WHERE address=$address";

if($result = $conn->query($set_play_num)) {

	// echo "YEP ";
	// hopefully success

}


// tx data storage
$table = 'token_treasury';

$qry = "INSERT INTO $table(address, gameId, cp_token, eth_token) VALUES ('$address', $gamenum, $cp_token_change, $ethCost)";


if ($conn->query($qry) === TRUE) {
    // echo "New record created successfully";
    echo $cp_token_change;
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}

$conn->close();

// echo "Success";
        
    
?>
