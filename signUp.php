<?php

header('Content-Type: application/json');

if (
    isset($_POST['email']) &&
    isset($_POST['password']) &&
    isset($_POST['firstName']) &&
    isset($_POST['lastName'])
) {
    session_start();

    $servername = "localhost";
    $username   = "root";
    $password   = "";
    $dbname     = "dating_website";

    // Create connection
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $data        = ['data' => []];
    $newUsername = $_POST['email'];
    $newPassword = $_POST['password'];
    $firstName   = $_POST['firstName'];
    $lastName    = $_POST['lastName'];

    $sql         = "select * from users where username='$newUsername'";
    $result      = mysqli_query($conn,$sql);

    if (mysqli_num_rows($result) == 0) {
        $sql = "insert into users (first_name, last_name, username, password) values('$firstName','$lastName','$newUsername','$newPassword')";


        if (mysqli_query($conn,$sql)) {
            $_SESSION['currentUserId'] = mysqli_insert_id($conn);
            $_SESSION['profileUserId'] = $_SESSION['currentUserId'];

            $data['data'] = [
                'headers' => [
                    'statusCode' => 201,
                    'message' => 'OK'
                ],
                'body' => [
                    'email'     => $newUsername,
                    'password'  => $newPassword,
                    'firstname' => $firstName,
                    'lastname'  => $lastName,
                ]
            ];

            // header("location: editProfile.php");
        }

    } else {
        $data['data'] = [
            'headers' => [
                'statusCode'  => 501,
                'message' => 'Oops!',
            ],
            'body' => NULL,
        ];

        // setcookie("loginError","El usuario ya existe! Por favor ingresa otro email",time()+5);
        // header("location: login.php");
    }

} else { 
    $data['data'] = [
        'headers' => [
            'statusCode'  => 501,
            'message' => 'Oops!',
        ],
        'body' => NULL,
    ];

    // setcookie("loginError","Oops! Primero debes registrarte",time()+5);
    // header("location: login.php");
}

$json = json_encode($data);

print_r($json);
