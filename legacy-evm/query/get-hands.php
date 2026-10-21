<?php

//var_dump($_GET);

$address = $_GET['addr'];
// echo $address;	// - $game_id - $hand_string";
// echo "hello";

//Encode the data as a JSON string
// $jsonStr = json_encode($jsonData);
$jsonData = [];

// lookup prgram name form program ID in database
require('db_auth.php');

$qry = "SELECT * FROM allhands WHERE address='$address' AND fold='false' ORDER BY id ASC"; // WHERE `address`=$address";

if($result = $conn->query($qry)) {

    $index = 1;     // index for hand num by current user
    // display the table data for each row
    while ($row = $result->fetch_assoc()) {

    	// print_r($row);

      	// set the internal variables per row
        //$this_id = $row["id"];
        //$this_timestamp = $row["timestamp"];
        //$game_id = $row["gameId"];
        $hand_string = $row["handString"];

        // $export .= "hand $index".$hand_string.",";
        // echo "$index => $hand_string";
        $thisData = "$index => $hand_string";

        array_push($jsonData, $thisData);

        //echo $jsonData;


        $index++;
    }

    // $export .= "]";     // end the array definitition

    // var_dump($jsonData);

    $myJSON = json_encode($jsonData);

    echo $myJSON;

}

$conn->close();
        
    
?>
