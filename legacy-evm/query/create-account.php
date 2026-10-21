<?php

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

$address = $data->address;
// $newusername = $data->username;
$is_new = true;			// assume until proven otherwise

// var_dump($data);

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

$table = 'userAccounts';

$qry_user = "SELECT * FROM $table";
// $qry_user = "SELECT * FROM $table WHERE 'address' = '$address'";

if($result = $conn->query($qry_user)) {

	// var_dump($qry_user);
	// var_dump($result);

	//$num_rows = $result->num_rows;

	// var_dump($num_rows);

	// if($num_rows >= 0){
		// display the table data for each row
	  while ($row = $result->fetch_assoc()) {

	    // set the internal variables per row

	    	// var_dump($row);

	      $this_address = $row["address"];
	      $playnum = $row["playnum"];

	      // var_dump($this_address);
	      // var_dump($this_address === $address);

	      if($this_address == $address){
	      	// user exists in db
	      	echo "If we get here, then the user with address $address already has an account in the system with playnum: $playnum";

	      	// echo "YEP ";		// this FLAG will cause the true report to fail for new user creation in js

	      	$is_new = false;		// set flag

	      	break;		// get out

	      } 

	  }			// end while

	  
}	

// add to db if is_new flag is set.
if($is_new) {		// end of result rows > 0
	

		// if we do not have an entry in the databse, then we will need to create one
		$table = 'userAccounts';
		$qry = "INSERT INTO $table(address, playNum, username, email) VALUES('$address', 0, NULL, NULL) ";


		if ($conn->query($qry) === TRUE) {
		    echo "true";		// use this as indicator for update success
		} else {
			// since address is unique, subsequent attempts to re-insert will fail
		    echo "Error: " . $qry . "<br>" . $conn->error;
		}

}	




$conn->close();
        
    
?>
