<?php

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

// var_dump($data);

$address = $data->address;
$newusername = $data->username;
$newemail = $data->email;

// get current playcount for account number from database -> VIP Status?
require('db_auth.php');

$qry_user = "SELECT * FROM userAccounts WHERE address='$address'";

if($result = $conn->query($qry_user)) {

}

$table = 'userAccounts';

if($newusername !== "") {
	// echo "Nope";
	$qry = "UPDATE $table SET username = '$newusername' WHERE address = '$address'";

} else {
	// echo "Yep";
	$qry = "UPDATE $table SET email = '$newemail' WHERE address = '$address'";

}

if ($conn->query($qry) === TRUE) {
    echo "true";		// use this as indicator for update success
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}

	

$conn->close();
        
    
?>
