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

echo "GameNum: $gamenum | tx for address: $address";

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');



// get play number for current game

$qry_total_hands = "SELECT * FROM allhands WHERE gameId='$gamenum'";

if($result = $conn->query($qry_total_hands)) {

	// echo "YEP ";
	$hand_total = 0;	// init to 0
	$hand_total = $result->num_rows;

}



// tx data storage
$table = 'token_treasury';
$cp_token_change = -1;
$eth_change = 0;

// conditional hand "cost" -> (credit eth) based on which 1000 hands we are in.
// EVENTUALLY THIS WILL BE HANDLED AT THE TOKEN BUY POINT, NOT THE TOKEN SPEND POINT
if ($hand_total < 2000) { $eth_change = 0; } else 
if ($hand_total >= 2000 && $hand_total < 3000) { $eth_change = 0.0000001; } else 
if ($hand_total >= 3000 && $hand_total < 4000) { $eth_change = 0.000001; } else
if ($hand_total >= 4000 && $hand_total < 5000) { $eth_change = 0.00001; } else 
if ($hand_total >= 5000 && $hand_total < 6000) { $eth_change = 0.0001; } else  
if ($hand_total >= 6000 && $hand_total < 7000) { $eth_change = 0.001; } else 
if ($hand_total >= 7000 && $hand_total < 8000) { $eth_change = 0.01; } else 
if ($hand_total >= 8000 && $hand_total < 9990) { $eth_change = 0.1; } else { $eth_change = 0.5; }

// Override eth change to 0 as this should be a no cost tx

$default_fees = 0.00001;		// mint takes only the min base fee for each token spend 

// $qry = "INSERT INTO $table(address, gameId, handString) VALUES ('0xTHISISANADDRESSSTORAGESPOT', 1, '2,5,6,3,45')";
$qry = "INSERT INTO $table(address, gameId, cp_token, eth_token) VALUES ('$address', $gamenum, $cp_token_change, $default_fees)";


if ($conn->query($qry) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}

$conn->close();

// echo "Success";
        
    
?>
