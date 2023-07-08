<!doctype html>
<html lang="en">
  <head>
    <title>Senshi Academy Check-in · Weekly Summary Report</title>
  </head>


  <h3 class="masthead-brand">Senshi Academy Check-in</h3>


  <?php

  // get programs from db
  require('db_auth.php');

  // this is get variables for mail setup:
  $p_email = $_POST['p_email'];   // maybe sendto address
  



    // set date to today for date picker
    $day = date("j");
    $month = date("m");
    $year = date("Y");

    // use GET override to set the date if the date clicker is picked
    $picked_day = $_GET['date'];
    $picked_month = $_GET['m'];
    $picked_year = $_GET['y'];

    // use POST for ajax
    if($_POST){
      $picked_day = $_POST['date'];
      $picked_month = $_POST['month'];
      $picked_year = $_POST['year'];
    }

    // override from today only if variables have been entered.
    if (!empty($picked_day)) {
      $day = $picked_day;
    }
    // TODO, duplicate for month and year to allow for ANY Selector via querystring
    if (!empty($picked_month)) {
      $month = $picked_month;
    }
    if (!empty($picked_year)) {
      $year = $picked_year;
    }

    /*********************************************************************************************/
    /*** Program to email weekly summary list begins here ***/
    /*********************************************************************************************/

    // Send submission via email
    // Setting a timezone, mail() uses this.
    date_default_timezone_set('America/New_York');
    $time = date('m/d/Y h:i:s a', time());
     
     // recipients of email notification (admin)
    // $to = "help@tranmer.ca";
    $to = "help@tranmer.ca, julie.tranmer@gmail.com";

      // subject 
    $subject = "Weekly Participant Summary Report - Senshi Martial Arts";

    // Your message here:
    $body = "
    <html>
    <head>
    <title>Form submission for Weekly Participant Summary</title>
    </head>
    <body style='width:600px; margin:0 auto 20px; border:2px double black; padding: 20px;'>

      <p style='text-align:center'><img src='https://senshiacademy.ca/wp-content/uploads/2019/10/senshi-logo-combined.jpg' alt='PARTNER LOGO GOES HERE' style='max-width:100%;'/></p>";


    // Body of email message is constructed throughout the program and is echoed to the html at the end.


    /*********************************************************************************************/
    /*** Program to build weekly summary list begins here ***/
    /*********************************************************************************************/
  

  // get todays date
  $day_of_week = date("l");
  $date_today = date("jS \of F Y");
  $hour_now = date("h") - 5;

  // internal counter variable for summaries
  $prog_day_num = 0;
  $day_total_num = 0;
  $week_total_num = 0;
  $wk_sum = array();
  $prog_names = array();

  $do_once = true;

  $tz = 'America/Toronto';
  $timestamp = time();
  $dt = new DateTime("now", new DateTimeZone($tz)); //first argument "must" be a string
  $dt->setTimestamp($timestamp); //adjust the object to correct timestamp
  // outputs
  $body .= "<small>Report Generation Time: ";
  $body .= $dt->format('d.m.Y, h:i:s A');

  $body .= "</small>";
  $body .= "<table>";

  // get all participat registrations
  $all_reg = $conn->query("SELECT * FROM p_registrations ORDER BY prog_id ASC");
  // var_dump($all_reg);

  while ($row = $all_reg->fetch_assoc()) {
    $this_prog_id = $row["prog_id"];
    $timestamp = $row["timestamp"];
    $this_nickname = $row["nickname"];

    if($result = $conn->query("SELECT * FROM programs WHERE id=$this_prog_id")) {
      while ($row = $result->fetch_assoc()) {
        $last_prog_name = $this_prog_name;
        $this_prog_name = $row["name"];

        // set progname array
        $prog_names[$this_prog_id] = $this_prog_name;
      }   // END WHILE

    } // END IF

    $current = strtotime("$day-$month-$year");
    $date = strtotime($timestamp);

    $datediff = $date - $current;
    $difference = floor($datediff/(60*60*24));

    // output date,once per day
    if($do_once) {
      $body .= "<tr><th>Base Day: $day-$month-$year <small></th></tr>";

      $do_once = false;
    }

    if($this_prog_name && $last_prog_name != $this_prog_name) {
      // if the program has attendance for the day
      if($prog_day_num > 0) {
        // this to display the program name (conditional, if non-nero)
        $body .= "<tr><th>$last_prog_name</th></tr>";
        $body .= "<tr><td>Summary:</td><td>Count: $prog_day_num</td></tr>";
      }

      //day total varibale accumulation
      $day_total_num = $day_total_num + $prog_day_num;
      // prog_day_num reset var
      $prog_day_num = 0;
      
    }

    // this conditional to determine if the date on the check-in matches the current day
    if($difference == 0) {
      // increment the program internal counter
      $prog_day_num++;

      // increment the weekly summary array
      $wk_sum[$this_prog_id]++;

      // this to output individual registrant names
      // echo "<tr>";
      // echo "<td>$timestamp</td>
      //     <td>$this_nickname</td>
      //     <td>$this_prog_name</td>
      //   ";

      // echo "</tr>";
    }   // END IF difference
    
  }   // END WHILE row

  // final day total varibale accumulation
  $day_total_num = $day_total_num + $prog_day_num;
  $week_total_num = $week_total_num + $day_total_num;

  //  last row summary output
  if($prog_day_num > 0) {
    $body .= "<tr><th>$last_prog_name</th></tr>";
    $body .= "<tr><td>Summary:</td><td>Count: $prog_day_num</td></tr>";
  }
  
  // end table (day) summary
  $body .= "<tr style='border:1px solid black'><th>Day Summary:</td><td>Total Count: </td><td>$day_total_num</td></tr>";
  $body .= "</table>";
  $body .= "<hr>";


  for ($x = 1; $x <= 7; $x++) {

    // this is a iteration to get the previous day
    $day = $day - 1;

    // reset day_total_num variable
    $prog_day_num = 0;
    $day_total_num = 0;

    // reset do_once flag
    $do_once = true;

    $body .= "<table>";

    // get all participat registrations
    $all_reg = $conn->query("SELECT * FROM p_registrations ORDER BY prog_id ASC");

    while ($row = $all_reg->fetch_assoc()) {
      $this_prog_id = $row["prog_id"];
      $timestamp = $row["timestamp"];
      $this_nickname = $row["nickname"];

      // IF query has a result
      if($result = $conn->query("SELECT * FROM programs WHERE id=$this_prog_id")) {
        while ($row = $result->fetch_assoc()) {
          $last_prog_name = $this_prog_name;
          $this_prog_name = $row["name"];
        }

      }

      // Get base day month year from page setting
      $base_dmy = "$day-$month-$year";

      $current = date($base_dmy, strtotime("+1 day"));

      $current = strtotime($current);
      $date = strtotime($timestamp);

      $datediff = $date - $current;
      $difference = floor($datediff/(60*60*24));

      // output date,once per day
      if($do_once) {
        $body .= "<tr><th>Day: $day-$month-$year</th></tr>";

        $do_once = false;
      }

      if($this_prog_name && $last_prog_name != $this_prog_name) {
        if($prog_day_num > 0){
          $body .= "<tr><th>$last_prog_name</th></tr>";
          $body .= "<tr><td>Summary:</td><td>Count: $prog_day_num</td></tr>";
        }

        //day total varibale accumulation
        $day_total_num = $day_total_num + $prog_day_num;
        // prog_day_num reset var
        $prog_day_num = 0;
        
      }

      if($difference == 0) {
        // increment the internal program counter
        $prog_day_num++;

        // increment the weekly summary array
        $wk_sum[$this_prog_id]++;

        // this to output individual registrant names
        // echo "<tr>";
        // echo "<td>$timestamp</td>
        //     <td>$this_nickname</td>
        //     <td>$this_prog_name</td>
        //   ";

        // echo "</tr>";
      }
      
    }

    //  last row summary

    // final day total varibale accumulation
    $day_total_num = $day_total_num + $prog_day_num;
    $week_total_num = $week_total_num + $day_total_num;

    if($prog_day_num > 0) {
      $body .= "<tr><th>$last_prog_name</th></tr>";
      $body .= "<tr><td>Summary:</td><td>Count: $prog_day_num</td></tr>";
    }

    // always show day summary
    $body .= "<tr style='border:1px solid black'><th>Day Summary:</td><td>Total Count: </td><td>$day_total_num</td></tr>";

    $body .= "</table>";

    $body .= "<hr>";

  }   // end for loop for 6 days 

$body .= "<ul><strong>Program Summary:</strong></ul>";

// add in program summary, with totals for week per program, sorted from most to least attended
arsort($wk_sum);

foreach ($wk_sum as $key => $value) {
  $body .= "<li>$prog_names[$key] - $value checkins</li>";   // $key is program id number
}

$body .= "<h2>Weekly Summary: $week_total_num participants in total</h2>";


// $test_out = print_r($wk_sum);

// $body .= $test_out;



echo $body;

// End Body closure for email message
$body .= "</body>
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
    $success = mail($to, $subject, $body, $headers);


?>

</html>


