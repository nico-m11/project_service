<?php
require_once '../config/Config.php';
// require_once '../../../vendor/autoload.php';
// use Automattic\WooCommerce\Client;


require 'EventLog.php';
require "../resources/PHPMailer-master/src/Exception.php";
require "../resources/PHPMailer-master/src/PHPMailer.php";
require "../resources/PHPMailer-master/src/SMTP.php";

require 'EmailSistem.php';
// require 'StripeSistem.php';
// require_once 'ACSistem.php';

class Users
{
    // var connessione al db e tabella
    private $conn;
    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    // Login user
    public function LoginUser($output)
    {

        // fields
        $email = addslashes($output["email"]);
        $password = hash("sha256", $output["password"]);

        $sql_control = "SELECT * FROM users WHERE email = '$email' AND password = '$password' AND active = 0 AND deleted = 0";
        //preparo l'istruzione
        $stmt_control = $this->conn->prepare($sql_control);

        //execute query
        $stmt_control->execute();

        if ($stmt_control->rowCount() == 0) {

            $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password' AND deleted = 0";

            //preparo l'istruzione
            $stmt = $this->conn->prepare($sql);

            //execute query
            $stmt->execute();

            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return $this->GetUser($users);
        } else {
            return -1;
        }
    }

    // LOST PASSWORD SISTEM
    // Create log of request
    public function LostPassword($output)
    {

        // fields
        $email = addslashes($output["email"]);
        $token = $this->generateRandomString(20);
        $date_request = date("Y-m-d H:i:s");
        $date_deadline = date("Y-m-d H:i:s", strtotime("+ 5 minutes"));
        $browser = $output["browser"];

        $sql_control = "SELECT * FROM users WHERE email = '$email' AND active = 1 AND deleted = 0";

        //preparo l'istruzione
        $stmt_control = $this->conn->prepare($sql_control);

        //execute query
        $stmt_control->execute();

        if ($stmt_control->rowCount() > 0) {

            $sql = "INSERT INTO users_request_password (token,date_request,date_deadline,email,browser) VALUES ('$token','$date_request','$date_deadline','$email','$browser')";

            //preparo l'istruzione
            $stmt = $this->conn->prepare($sql);

            //execute query
            $stmt->execute();

            $req = $this->conn->lastInsertId();
        } else {
            return -1;
        }
    }

    // control the request of change password
    public function RequestChangePassword($output)
    {

        $code = $output["code"];
        $token = $output["token"];
        $req = $output["req"];

        $now = date("Y-m-d H:i:s");

        $sql_control = "SELECT * FROM users_request_password WHERE id_request = '$req' AND token = '$token' AND date_deadline >= '$now' ORDER BY id_request DESC LIMIT 1";

        //preparo l'istruzione
        $stmt_control = $this->conn->prepare($sql_control);

        //execute query
        $stmt_control->execute();

        if ($stmt_control->rowCount() > 0) {

            $request = $stmt_control->fetch(PDO::FETCH_ASSOC);
            $email = $request["email"];
            //$email_code = md5($email);
            $email_code = hash("sha256", $email);

            if ($email_code == $code) {
                $sql = "SELECT * FROM users WHERE email = '$email' AND active = 1 AND deleted = 0";

                //preparo l'istruzione
                $stmt = $this->conn->prepare($sql);

                //execute query
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);

                    $info_user = $this->GetUserInfo($user["id_user"]);

                    $result = array(
                        "id_user" => $info_user["id_user"],
                        "password" => $info_user["password"],
                        "email" => $info_user["email"]
                    );

                    return [$result];
                } else {
                    return -2;
                }
            }
        } else {
            return -1;
        }
    }

    // Create User 
    public function CreateUser($output)
    {
        $email = isset($output['email']) ? $output['email'] : '';
        $password = isset($output['password']) ? hash("sha256", $output['password']) : '';
        $name = isset($output['name']) ? $output['name'] : '';
        $username = isset($output['username']) ? $output['username'] : '';
        $role = isset($output['role']) ? $output['role'] : 0;
        $accesToken = "access-token-" . $this->generateRandomString(32);

        $sql = "INSERT INTO 
        `users`( `name`, `username`, `email`, `accessToken`, `password`, `active`, `deleted`, `role`) 
        VALUES ('$name','$username','$email','$accesToken','$password', 1, 0, '$role')";

        $stmt = $this->conn->prepare($sql);
        try {
            $stmt->execute();
            $stmt->rowCount();
            $stmt->fetch(PDO::FETCH_ASSOC);
            return true;
        } catch(Exception) {
            throw new Exception("User not create");
        }
    }

    public function GetUserByToken($token)
    {

        $token = $token['accessToken'];

        $sql = "SELECT * FROM users WHERE users.accessToken LIKE '$token' AND users.deleted = 0";

        //preparo l'istruzione
        try {
            $stmt = $this->conn->prepare($sql);

            //execute query
            $stmt->execute();
            if ($stmt->rowCount() == 1) {

                $user = $stmt->fetchAll(PDO::FETCH_ASSOC);

                $user = $user[0];

                $result = [
                    "id"              => $user['id_user'],
                    'name'            => $user['name'],
                    "email"           => $user['email'],
                    "authToken"       => $user['accessToken'],
                    "role"            => $user['role']
                ];

                return $result;
            } else return ['code' => 403, 'message' => 'Forbidden'];
        } catch (PDOException $e) {
            return ['code' => 500, 'message' => "Error code: " . $e->getCode() . "\n" . $e->getMessage()];
        }
    }

    public function UpdatePassword($input)
    {
        $oldPassword = $input['values']['currentPassword'];
        $newPassword = $input['values']['password'];
        $cPassword = $input['values']['cPassword'];
        $idUser = $input['idUser'];
        $nomeCompleto = $input['fullname'];
        $email = $input['email'];

        $hashedOldPassword = hash("sha256", $oldPassword);
        $sql = "SELECT COUNT(*) AS checkOldPassword FROM user WHERE password LIKE '$hashedOldPassword' AND id = $idUser";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $checkOldPassword = $stmt->fetch(PDO::FETCH_ASSOC);
        $checkOldPassword = $checkOldPassword['checkOldPassword'];

        if ($checkOldPassword > 0 && $newPassword == $cPassword) {
            $hashedPassword = hash("sha256", $newPassword);
            $sql = "UPDATE user SET password = '$hashedPassword' WHERE id = $idUser";
            try {
                $stmt = $this->conn->prepare($sql);
                $stmt->execute();

                $mail = new EmailSistem();
                $oggetto = "Modifica della password di DokyHR";
                $messaggio =
                    "<html>
                
                <body>
                <p>Ciao $nomeCompleto,</p><br/>
                <p>La tua password di DokyHR è stata modificata alle " . date("H:i") . " del" . date("d-m-Y") . "</p>
                <p><strong>Se sei stato tu</strong>, puoi tranquillamente ignorare questa e-mail</p><br/>
                <p>Grazie, il team di DokyHR.</p>
                </body>
                </html>";

                $mail->SendMail($email, $oggetto, $messaggio);
            } catch (PDOException $e) {
            }
            return [
                "message" => "Password cambiata correttamente",
                "color" => "green"
            ];
        } else return [
            "message" => "Password errata",
            "color" => "red"
        ];
    }

    public function ForgottenPassword($input)
    {
        $email = $input['email'];

        $sql = "SELECT emailAziendale FROM user WHERE email LIKE '$email' AND emailAziendale NOT LIKE 'undefined'";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();

        $newPassword = $this->generateRandomString(16);
        $hashedPassword = hash("sha256", $newPassword);
        if ($stmt->rowCount() > 0) {
            $email = $stmt->fetch(PDO::FETCH_ASSOC);
            $email = $email['emailAziendale'];
        } else {
            $email = $input['email'];
        }


        try {

            $mail = $input['email'];
            $sql = "SELECT user.email, user_data.firstname, user_data.lastname 
                    FROM user JOIN user_data ON user.id = user_data.id_user 
                    WHERE user.email LIKE '$mail'";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($stmt->rowCount() > 0) {



                $sql = "UPDATE `user` SET `password` = '$hashedPassword' WHERE email LIKE '$mail'";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute();

                $nomeCompleto = $user['firstname'] . " " . $user['lastname'];

                $messaggio =
                    "<html>
                
                <body>
                <p>Ciao $nomeCompleto,</p><br/>
                <p>Hai richiesto di recuperare la tua password di DokyHR alle " . date("H:i") . " del" . date("d-m-Y") . "</p>
                <p>Utilizza questa password per effettuare l'accesso:</p><br/>
                <p>$newPassword</p>
                <p>Ti consigliamo di cambiarla al più presto nell'apposita sezione.</p>
                <p>Grazie, il team di DokyHR.</p>
                </body>
                </html>";

                $mail = new EmailSistem();
                $oggetto = "DOKYHR - Recupero password";

                $mail->SendMail($email, $oggetto, $messaggio);

                return [
                    "message" => "Email di recupero inviata con successo!",
                    "color" => "green"
                ];
            } else {
                return [
                    "message" => "Email non trovata!",
                    "color" => "red"
                ];
            }
        } catch (PDOException $e) {
            return $e->getMessage();
        }
    }
    public function GetUser($users): array
    {
        $result = array();
        foreach ($users as $key => $user) {

            $result[] = $this->GetUserInfo($user["id_user"]);
        }

        return $result;
    }
    public function GetUserInfo($id_user): array
    {


        $sql = "SELECT * FROM `users`  WHERE users.id_user = $id_user";


        //preparo l'istruzione
        $stmt = $this->conn->prepare($sql);

        //execute query
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);


        $result = [
            "id"              => $user['id_user'],
            "email"           => $user['email'],
            "authToken"       => $user['accessToken'],
        ];

        return $result;
    }
}
