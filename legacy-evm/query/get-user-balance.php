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

// echo $address;
// echo $gamenum;

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

$qry_user_balance = "SELECT * FROM token_treasury WHERE gameId='$gamenum' AND address='$address'";

// echo $qry_prog;

if($result = $conn->query($qry_user_balance)) {

	// var_dump($result);
	$token_total = 0;

	// display the table data for each row
  while ($row = $result->fetch_assoc()) {

  	$token_total = $token_total + $row["cp_token"];

      // set the internal variables per row
      // $end_time = $row["end_time"];
      // $cptoken_treasury = $row["cptoken_treasury"];
      // $eth_treasury = $row["eth_treasury"];
  	// echo "Add one row. ";

    }

    echo $token_total;

}


$conn->close();
        
    
?>
