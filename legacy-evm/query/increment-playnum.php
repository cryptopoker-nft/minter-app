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
$playnum = $data->playNum;		// will be int and set if override is required for first buyim

echo "GameNum: $gamenum | tx for address: $address";

$table = "userAccounts";

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

if($playnum > 0){
	// is set to override

	// update playnum
	$qry = "UPDATE $table SET playnum = '$playnum' WHERE address = '$address'";


	if ($conn->query($qry) === TRUE) {
	    echo "New record created successfully";
	} else {
	    echo "Error: " . $qry . "<br>" . $conn->error;
	}


} else {
	// count and then set
	// get play number for current game by tracking all hands that have been played

	$qry_total_hands = "SELECT * FROM allhands WHERE gameId='$gamenum' AND address='$address'";

	if($result = $conn->query($qry_total_hands)) {

		// echo "YEP ";
		$hand_total = 0;	// init to 0
		$hand_total = $result->num_rows;

	}

	echo $hand_total;


	// update playnum
	$qry = "UPDATE $table SET playnum = '$hand_total' WHERE address = '$address'";


	if ($conn->query($qry) === TRUE) {
	    echo "New record created successfully";
	} else {
	    echo "Error: " . $qry . "<br>" . $conn->error;
	}
}





$conn->close();

// echo "Success";
        
    
?>
