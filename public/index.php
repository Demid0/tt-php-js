<?php
require_once '../vendor/autoload.php';
header('Content-type: text/html; charset=utf-8');

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($uri === '/api/checkAndSave') {
    require '../src/check_and_save.php';
}
else if ($uri === '/api/getHistory') {
    require '../src/get_history.php';
}
else {
    require 'index.html';
}