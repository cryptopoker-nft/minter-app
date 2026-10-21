<?php


// echo "Received JSON via POST: ";

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

var_dump($data);

$address = $data->address;
$game_id = $data->gameId;
$mint_num = $data->mintNum;

require('db_auth.php');

$table = 'allhands';

$qry_update = "UPDATE $table SET fold='true',address='$address' WHERE id = '$mint_num'";

if ($conn->query($qry_update) === TRUE) {
    echo "Your selected hand has been folded successfully.";
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}


$conn->close();
        
    
?>
