<?php

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

// $gamenum = $data->gameNum;
$address = $data->address;

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

$qry_user_data = "SELECT * FROM userAccounts WHERE address='$address' LIMIT 1";

if($result = $conn->query($qry_user_data)) {

	$token_total = 0;

	// display the table data for each row
  while ($row = $result->fetch_assoc()) {

		$username = $row["username"];
		$email = $row['email'];

  }

}

// lookup 2 - allhands table data
$qry_user_hands = "SELECT * FROM allhands WHERE address='$address'";

if($result = $conn->query($qry_user_hands)) {
	$hands_played = $result->num_rows;

}

// lookup 3 - token_treasury table data
$qry_user_funds = "SELECT * FROM token_treasury WHERE address='$address'";

if($result = $conn->query($qry_user_funds)) {

	//$hands_played = $result->num_rows;
	$total_spent = 0.0;
	$buyins = 0;

	// display the table data for each row
  while ($row = $result->fetch_assoc()) {
  	$total_spent += $row['eth_token'];
  	$cp_token_delta = $row["cp_token"];

  	if($cp_token_delta > 0) { $buyins++; }

  }

}

// $buyins = 1;
// $hands_played = 6;
// $total_spent = 0.001;


// build json data & export for javascript

$myObj->username = $username;
$myObj->email = $email;

// gather from hand records
$myObj->buyins = $buyins;
$myObj->hands_played = $hands_played;
$myObj->total_spent = $total_spent;

$myJSON = json_encode($myObj);

echo $myJSON;


$conn->close();
        
    
?>
