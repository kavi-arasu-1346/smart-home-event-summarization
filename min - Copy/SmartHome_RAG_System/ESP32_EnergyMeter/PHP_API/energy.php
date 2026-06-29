<?php

$conn = new mysqli("localhost","root","","smarthome");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_POST['voltage'])) {
    $voltage = $_POST['voltage'];
    $current = $_POST['current'];
    $power = $_POST['power'];
    $kwh = $_POST['kwh'];

    $sql = "INSERT INTO energy_meter (voltage,current,power,kwh)
    VALUES ('$voltage','$current','$power','$kwh')";

    if ($conn->query($sql) === TRUE) {
        echo "Data Stored successfully";
    } else {
        echo "Error: " . $conn->error;
    }
} else {
    echo "No sensor data received";
}

$conn->close();

?>
