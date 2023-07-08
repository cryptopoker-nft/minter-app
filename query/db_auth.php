<?php

$username = "tomtranm_cpdemo_u";
$password = "nci2aqbW!3Cr-V@K";
$dbname = "tomtranm_cpdemo";

// MySQL connect
$conn = new mysqli("localhost", $username, $password, $dbname);
$conn->set_charset("utf8");
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>