<?php


echo "Hello and welcome to PHP";

$p_email = $_POST['p_email'];
// $send_to_p = $_POST['p_check']
$prog_id = $_POST['prog_id'];
$p_nick = $_POST['p_nick'];
$p_radio = $_POST['p_radio'];
$p_check = $_POST['p_check'];


// lookup prgram name form program ID in database
require('db_auth.php');

$qry_prog = "SELECT * FROM programs WHERE id=$prog_id";

// echo $qry_prog;

if($result = $conn->query($qry_prog)) {

    var_dump($result);
    // display the table data for each row
    while ($row = $result->fetch_assoc()) {

      // set the internal variables per row

        // $this_id = $row["id"];
        // $this_timestamp = $row["timestamp"];
        $progname = $row["name"];
        $progdesc = $row["description"];
        $this_date = $row["date"]; 
        $this_time_from = $row["time_from"];
        $this_time_to = $row["time_to"];
        // $this_court_num = $row["court_num"];
        // $this_player_limit = $row["player_limit"];
        $cost = $row["cost"]; 
    }

}

// Send submission via email
// Setting a timezone, mail() uses this.
date_default_timezone_set('America/New_York');
$time = date('m/d/Y h:i:s a', time());
 
 // recipients of email notification (admin)
$to = "help@tranmer.ca";
// $to = "help@tranmer.ca, julie.tranmer@gmail.com";

  // subject 
$subject = "Form submission for Participant Submission [$progname] - [$p_email]";

// Your message here:
$body = "
<html>
<head>
<title>Form submission for Participant Submission</title>
</head>
<body style='width:600px; margin:0 auto 20px; border:2px double black; padding: 20px;'>

	<p style='text-align:center'><img src='https://tranmer.ca/gsm-hit-club/img/mail-logo.jpg' alt='PARTNER LOGO GOES HERE' style='max-width:100%;'/></p>

	<ul>
		<li>Player nickname for site: $p_nick</li>
		<li>Submitted By (email-optional): $p_email</li>
		<li>Program Requested: $progname, ID:($prog_id)</li>
		<li>Program Description: $progdesc</li>
		<li>On: $this_date at $this_time_from to $this_time_to</li>
		<li>Hours In: $p_radio</li>
	</ul>

	<p>The program you selected <strong>has a cost of $".number_format($cost,2)." per hour of play</strong>. Payment can be applied to the club account at GSM for Tom Tranmer, or via PayPal or interac transfer to <a href='mailto:tom.tranmer@gmail.com?Subject=Payment%20Inquiry'>tom.tranmer@gmail.com</a></p>

	<p>Program request submitted on: $time. Programs will be filled in First Come First Served order, with waitlist players advised. Duplicate registrations with the same name will be deleted. Stay Tuned!</p>
	
</body>
</html>
";


// To send HTML mail, you can set the Content-type header. 
$headers  = "MIME-Version: 1.0\r\n"; 
$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
$headers .= "From: Website Server <app@tranmer.ca>\r\n"; 
$headers .= "Reply-To: $to\r\n";
if ($p_check) {
	$headers .= "Cc: $p_email\r\n"; 
}


// Email notification of booking to both
// UNCOMMENT TO ENABLE
// $success = mail($to, $subject, $body, $headers);


// require('db_auth.php');
// New query to store data
$result = $conn->query("SELECT * FROM p_registrations");

// var_dump($result);


/* get all results from database and store in array */
$table = 'p_registrations';

$qry = "INSERT INTO $table(prog_id, p_email, nickname, p_radio, cookie) VALUES ($prog_id, '$p_email', '$p_nick', '$p_radio', '$p_check')";

// $qry = "INSERT INTO $table(p_email) VALUES ('$p_email')";

if ($conn->query($qry) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $qry . "<br>" . $conn->error;
}

$conn->close();


// if ( $wpdb->insert( $table, $data ) === FALSE ) {
// // data indicated for update does not exist, create the table row first and retry.    

//     echo "Trouble boss";
// } else {
//     echo "table: $table, email: $email, subject: $subject, report: $report || Updated";
// }

        
    
?>
