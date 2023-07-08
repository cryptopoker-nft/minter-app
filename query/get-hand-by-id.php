<?php

$address = $_GET['addr'];
$id = $_GET['id'];

//Encode the data as a JSON string
$jsonData = [];

// lookup prgram name form program ID in database
require('db_auth.php');

$qry = "SELECT * FROM allhands WHERE address='$address' AND fold='false' AND id='$id' LIMIT 1"; 
// WHERE `address`=$address";

if($result = $conn->query($qry)) {

    $index = 1;     // index for hand num by current user
    // display the table data for each row
    while ($row = $result->fetch_assoc()) {

        $hand_string = $row["handString"];
        $thisData = "$index => $hand_string";

        array_push($jsonData, $thisData);

        $index++;
    }

    $myJSON = json_encode($jsonData);

    echo $myJSON;       // shoudl output just one hand

}

$conn->close();
        
    
?>
