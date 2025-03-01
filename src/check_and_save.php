<?php
header('Content-type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);


$text = str_split($data['text']);
$eng_symb_indexes = [];
$no_alpha_indexes = [];
$ru_symb = 0;

foreach ($text as $i => $symb) {
    if (preg_match('/[A-Za-z]/iu', $symb) > 0) {
        $eng_symb_indexes[] = $i - $ru_symb / 2;
    } else if (preg_match('/[^a-zA-Zа-яА-ЯёЁ]/u', $symb) > 0) {
        $no_alpha_indexes[] = $i - $ru_symb / 2;
    } else {
        $ru_symb++;
    }
}

$res = [
    'lang' => count($eng_symb_indexes) * 2 > $ru_symb ? 'en' : 'ru',
    'engIndexes' => $eng_symb_indexes,
    'noAlphaIndexes' => $no_alpha_indexes,
    'checkedtext' => $data['text'],
    'datetime' => date('Y-m-d H:i:s')
];

$need_to_save = $data['save'];

if ($need_to_save) {

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();

    $dsn = "pgsql:host=" . $_ENV['DB_HOST'] . ";port=" . $_ENV['DB_PORT'] . ";dbname=" . $_ENV['DB_NAME'];
    try {
        $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASSWORD']);
        error_log("Connected to the database successfully!");
        if (!$pdo->prepare("insert into checks(checkedText, datetime, lang) values (?, ?, ?);")->execute([$data['text'], date('Y-m-d H:i:s'), $res['lang']])) {
            throw new Exception($pdo->errorInfo()[2]);
        }
    } catch (PDOException $e) {
        error_log("Connection failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

}

echo json_encode($res);
