<?php
// db.php
require_once __DIR__ . '/config.php';

function db(): PDO {
  global $dsn, $DB_USER, $DB_PASS;

  static $pdo = null;
  if ($pdo) return $pdo;

  $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  return $pdo;
}
