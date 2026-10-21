<?php

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

var_dump($data);

$address = $data->address;
$mint_num = $data->mintNum;

require('db_auth.php');

$table = 'allhands';

// assign ower to current user address and fold to FALSE given ID number
$qry_update = "UPDATE $table SET address='$address', fold='false' WHERE id = '$mint_num'";

if ($conn->query($qry_update) === TRUE) {
    echo "Your selected hand has been merged with chain data successfully.";
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}

$conn->close();
        
    
?>
