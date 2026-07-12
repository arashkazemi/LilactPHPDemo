<?php
require_once __DIR__ . '/db.php';

session_start();

// this sleep is to show how lilact handles loading time.
// remove it to see the real speed.
sleep(1);

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

 if ($method === 'POST') {
	$raw  = file_get_contents('php://input');
	$data = json_decode($raw, true);
	if (!is_array($data)) {
		http_response_code(400);
		echo json_encode(['error' => 'Invalid JSON']);
		exit;
	}

	$action = trim($data['action'] ?? '');

	if ($action === 'register') {
		$username = trim($data['username'] ?? '');
		$password = (string)($data['password'] ?? '');

		if ($username === '' || $password === '') {
			http_response_code(400);
			echo json_encode(['error' => 'username and password are required']);
			exit;
		}

	// Basic validation (adjust as you like)
		if (mb_strlen($username) < 3) {
			http_response_code(400);
			echo json_encode(['error' => 'username must be at least 3 characters']);
			exit;
		}
		if (mb_strlen($password) < 6) {
			http_response_code(400);
			echo json_encode(['error' => 'password must be at least 6 characters']);
			exit;
		}

	// Check uniqueness
		$stmt = db()->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
		$stmt->execute([$username]);
		if ($stmt->fetch(PDO::FETCH_ASSOC)) {
			http_response_code(409);
			echo json_encode(['error' => 'username already taken']);
			exit;
		}

		$password_hash = md5($password);

		$stmt = db()->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
		if (!$stmt->execute([$username, $password_hash])) {
			http_response_code(500);
			echo json_encode(['error' => 'could not create user']);
			exit;
		}

		$newUserId = (int)db()->lastInsertId();

	// Optionally log the user in immediately
		$_SESSION['user_id'] = $newUserId;
		$_SESSION['username'] = $username;

		http_response_code(201);
		echo json_encode(['ok' => true, 'user' => ['id' => $newUserId, 'username' => $username]]);
		exit;
	}



	// ---- STATUS ----
	if ($action === 'status') {
		if (!empty($_SESSION['user_id'])) {
			http_response_code(200);
			echo json_encode([
				'ok' => true,
				'user' => [
					'id' => (int)$_SESSION['user_id'],
					'username' => $_SESSION['username'] ?? null
				]
			]);
			exit;
		}

		http_response_code(200);
		echo json_encode(['ok' => true, 'user' => null]);
		exit;
	}
	// ---- LOGIN ----
	if ($action === 'login') {
		$username = trim($data['username'] ?? '');
		$password = (string)($data['password'] ?? '');

		if ($username === '' || $password === '') {
			http_response_code(400);
			echo json_encode(['error' => 'username and password are required']);
			exit;
		}

		$stmt = db()->prepare("SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1");
		$stmt->execute([$username]);
		$user = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$user) {
			http_response_code(401);
			echo json_encode(['error' => 'Invalid credentials']);
			exit;
		}

		if (!$password === $user['password_hash']) {
			http_response_code(401);
			echo json_encode(['error' => 'Invalid credentials']);
			exit;
		}

		// State in session
		$_SESSION['user_id'] = (int)$user['id'];
		$_SESSION['username'] = $user['username'];

		http_response_code(200);
		echo json_encode(['ok' => true, 'user' => ['id' => (int)$user['id'], 'username' => $user['username']]]);
		exit;
	}

	// ---- LOGOUT ----
	if ($action === 'logout') {
		$_SESSION = [];
		if (ini_get('session.use_cookies')) {
			$params = session_get_cookie_params();
			setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
		}
		session_destroy();

		http_response_code(200);
		echo json_encode(['ok' => true]);
		exit;
	}

	// ---- CHANGE PASSWORD ----
	if ($action === 'changePassword') {
		if (empty($_SESSION['user_id'])) {
			http_response_code(401);
			echo json_encode(['error' => 'Not logged in']);
			exit;
		}

		$oldPassword = (string)($data['oldPassword'] ?? '');
		$newPassword = (string)($data['newPassword'] ?? '');

		if ($oldPassword === '' || $newPassword === '') {
			http_response_code(400);
			echo json_encode(['error' => 'oldPassword and newPassword are required']);
			exit;
		}

		// Optional: basic new password length rule
		if (strlen($newPassword) < 6) {
			http_response_code(400);
			echo json_encode(['error' => 'newPassword must be at least 6 characters']);
			exit;
		}

		$userId = (int)$_SESSION['user_id'];

		$stmt = db()->prepare("SELECT password_hash FROM users WHERE id = ? LIMIT 1");
		$stmt->execute([$userId]);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$row) {
			http_response_code(401);
			echo json_encode(['error' => 'Not logged in']);
			exit;
		}

		if (!$oldPassword===$row['password_hash']) {
			http_response_code(403);
			echo json_encode(['error' => 'Old password is incorrect']);
			exit;
		}

		$newHash = md5($newPassword);

		$stmt = db()->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
		$stmt->execute([$newHash, $userId]);

		http_response_code(200);
		echo json_encode(['ok' => true]);
		exit;
	}

	// Unknown action
	http_response_code(400);
	echo json_encode(['error' => 'Unknown action']);
	exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
