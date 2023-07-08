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

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

$qry_master_contract = "SELECT * FROM masterContractStorage WHERE gameId='$gamenum' LIMIT 1";

// echo $qry_prog;

if($result = $conn->query($qry_master_contract)) {

	// var_dump($result);

	// display the table data for each row
  while ($row = $result->fetch_assoc()) {

      // set the internal variables per row
      $end_time = $row["end_time"];
      $cptoken_treasury = $row["cptoken_treasury"];
      $eth_treasury = $row["eth_treasury"];

    }

}

$qry_spend_balance = "SELECT * FROM token_treasury WHERE gameId='$gamenum'";

if($result = $conn->query($qry_spend_balance)) {

	// var_dump($result);
	// init storage variables
	$token_total = 0;
	$token_sold = 0;
	$token_spend = 0;
	$eth_total = 0;

	// display the table data for each row
  while ($row = $result->fetch_assoc()) {

  	$cp_token_delta = $row["cp_token"];
  	$eth_delta = $row["eth_token"];

  	if($cp_token_delta > 0) {
  		// add to token sold balance
  		$token_sold = $token_sold + $cp_token_delta;
  	} else {
  		// it's a record of a token spend (will be negative)
  		$token_spend = $token_spend + $cp_token_delta;
  	}

  	// total in this instance is the total number of tokens outstanding to be played (claimed, not minted)
  	$token_total = $token_total + $cp_token_delta;
  	$eth_total = $eth_total + $eth_delta;

      // set the internal variables per row
      // $end_time = $row["end_time"];
      // $cptoken_treasury = $row["cptoken_treasury"];
      // $eth_treasury = $row["eth_treasury"];

    }

    // echo $token_total;

}

// select unique = distinct addresses from hands in play
$qry_uniq = "SELECT DISTINCT address FROM allhands WHERE gameId='$gamenum'";

if($result = $conn->query($qry_uniq)) {
	$unique_addr = $result->num_rows;
}

// get total hand numbers

$qry_total_hands = "SELECT * FROM allhands WHERE gameId='$gamenum'";

// echo $qry_prog;

if($result = $conn->query($qry_total_hands)) {

	// echo "YEP ";
	$hand_total = 0;

    // var_dump($result);		// maybe can get the length of the result from here rather than looping?

	$hand_total = $result->num_rows;





    // display the table data for each row
    // while ($row = $result->fetch_assoc()) {

    // 	$hand_total++;

    //   // set the internal variables per row

    // 	// echo "If we get here, then the user already has an account in the system with playnum: ";

    //     // $address = $row["address"];
    //     // $playnum = $row["playnum"];

    //     // echo $playnum;

    //     // increment playnum only on mint or burn action (and trade?)

    // }

    // echo $hand_total;

}

// get only hands in play numbers
$qry_in_play = "SELECT * FROM allhands WHERE gameId='$gamenum' AND fold='false'";

// echo $qry_prog;

if($result = $conn->query($qry_in_play)) {

	$in_play = $result->num_rows;

}



	// build json data & export for javascript

	$myObj->end_time = $end_time;
	$myObj->cptoken_treasury = $cptoken_treasury;
	$myObj->eth_treasury = $eth_total;

	$myObj->token_total = $token_total;
	$myObj->token_sold = $token_sold;
	$myObj->token_spend = $token_spend;

	$myObj->unique_addr = $unique_addr;
	$myObj->total_hands = $hand_total;
	$myObj->hands_in_play = $in_play;


	$myJSON = json_encode($myObj);

	echo $myJSON;


	// if we do not have an entry in the databse, then we will need to create one
	// $table = 'userAccounts';
	// $qry = "INSERT INTO $table(address, playnum) VALUES ('$address', 0)";


	// if ($conn->query($qry) === TRUE) {
	//     echo "true";		// use this as indicator for new account creation
	// } else {
	// 	// since address is unique, subsequent attempts to re-insert will fail
	//     echo "Error: " . $qry . "<br>" . $conn->error;
	// }

$conn->close();
        
    
?>
