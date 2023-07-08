<?php


// echo "Received JSON via POST: ";

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$data = json_decode($json);

// var_dump($data);

$address = $data->address;
$game_id = $data->gameId;
$hand_string = "[" . $data->hand . "]";
$hand_length = $data->handLength;
$mintNum = $data->mintNum;

$debug = true;

/******************************************** DATABASE STORAGE ********************************/


require('db_auth.php');
// New query to store data
$table = 'allhands';
$qry = "INSERT INTO $table(id, address, gameId, handString) VALUES ($mintNum, '$address', $game_id, '$hand_string')";

if ($conn->query($qry) === TRUE) {
    $debug_output .= "Mint record added to db: ";

    $result = $conn->query( "SELECT * FROM allhands WHERE address='$address' AND gameId='$game_id' ORDER BY id DESC LIMIT 1" );

    while ($row = $result->fetch_assoc()) {
    	// need lastmint id to save filename
  		$last_mint = $row["id"];

        $debug_output .=  "Last Mint ID (handId): " + $last_mint;
        // This echo in order to have the mint php return only this data to the main script
        // echo $last_mint;
  	}

} else {
    $debug_output .=  "Error: " . $qry . "<br>" . $conn->error;
}



/**************************************** SAVE SVG FILE *************************************/

$content = $data->svg;                                              //	from POST data
$file_path = "../img/mint/$game_id-$address-$mintNum.svg";      //  for file saving
$nft_image_link = "https://tranmer.ca/tech/dapp/img/mint/$game_id-$address-$mintNum.svg";   // SAMPLEONLY for image output

if(file_put_contents($file_path, $content)) { // Filename for storing purpose
    $debug_output .= " Success with SVG local file creation. ";
}
else {
    $debug_output .= " Failed to save file";
}




/*********** END SVG ************/


/**************************************** EMAIL NOTIFICATION *************************************/

// Send submission via email
// Setting a timezone, mail() uses this.
date_default_timezone_set('America/New_York');
$time = date('m/d/Y h:i:s a', time());
 
 // recipients of email notification (admin)
$to = "tom@tranmer.ca";
// $to = "help@tranmer.ca, julie.tranmer@gmail.com";

  // subject 
$subject = "Mint submission notification - $hand_string / $game_id / $address";

// Your message here:
$body = "
<html>
<head>
<title>Form submission for Mint Success</title>
</head>
<body style='width:600px; margin:0 auto 20px; border:2px double black; padding: 20px;'>

	<p style='text-align:center'><img src=$nft_image_link alt='SVG IMAGE OF NFT GOES HERE -> IPFS Storage?' style='max-width:100%;'/></p>

	<ul>
        <li>HAND LENGTH: $hand_length</li>
		<li>Mint nickname by address: $address</li>
        <li>NFT Image Link: $nft_image_link</li>
		<li>Game ID: $game_id</li>
		<li>Hand Minted: $hand_string</li>
        <li>Mint Num: $mintNum</li>
	</ul>
	
</body>
</html>
";


// To send HTML mail, you can set the Content-type header. 
$headers  = "MIME-Version: 1.0\r\n"; 
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
$headers .= "From: CP Website Server <app@tranmer.ca>\r\n"; 
$headers .= "Reply-To: $to\r\n";
// if ($p_check) {
// 	$headers .= "Cc: $p_email\r\n"; 
// }


// Email notification of booking to both
// UNCOMMENT TO ENABLE -> also need to approve mail ports at Linode
// $success = mail($to, $subject, $body, $headers);

/********* END EMAIL ************/

/************** Error / Debug output *******************/

if($debug){ echo $debug_output; }


/*********** END PROGRAM **********/

$conn->close();
        
    
?>
