<?php

$domain = $_SERVER['SERVER_NAME'];
//INSERIRE PATH ASSOLUTA DEL SERVER 
$rootDir = isset($_SERVER["DOCUMENT_ROOT"]) && $_SERVER["DOCUMENT_ROOT"] != '' ? realpath($_SERVER["DOCUMENT_ROOT"]) : "/home/u949902263/domains/crurated.com/public_html/members";
$request_uri = str_replace("/", "-", $_SERVER['REQUEST_URI']);
$request_uri = str_replace(".php", "", $request_uri);

error_reporting(E_ALL);
setlocale(LC_TIME, "it_IT");


ini_set('log_errors', 1);
ini_set('error_log', '../EventLog/GeneralError/error_on$request_uri.txt');

define("KEY_API", hash('sha256', "gnakGnak!290193_luca"));
define('DOMAIN', "https://" . $domain);
define("ROOT_DIR", $rootDir);
/* define('PATH_URL', $path);
define('PATH_URL_MEDIA', $path_media); */