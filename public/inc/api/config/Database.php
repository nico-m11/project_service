<?php

class Database
{


 public $localKey = [
   "host" => "localhost",
   "dbName" => "svapo_1",
   "username" => "root",
   "password" => "root"
 ];

  public $conn;

  public function getConnection()
  {

    $dbName = $this->localKey['dbName'];
    $host = $this->localKey['host'];
    $username = $this->localKey['username'];
    $password = $this->localKey['password'];

    try {
      $this->conn = new PDO("mysql:host=" . $host . ";dbname=" . $dbName, $username, $password);
      $this->conn->exec("set names utf8");
    } catch (PDOException $exception) {
      echo "Connection error: " . $exception->getMessage();
    }

    return $this->conn;
  }
}
