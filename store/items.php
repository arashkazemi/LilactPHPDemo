<?php
require_once __DIR__ . '/db.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

$getInt = function ($key, $default) {
	return isset($_REQUEST[$key]) ? max(0, (int)$_REQUEST[$key]) : $default;
};

$id = $getInt('id', 0);

// ---- GET /items (with pagination) ----
if ($method === 'GET' && !$id) {
	$offset = $getInt('offset', 0);

	$count = $getInt('count', 20);
	$count = min($count, 50);

	$stmt = db()->prepare("
		SELECT
			i.id,
			i.title,
			i.content,
			u.username,
			i.created_by AS owner_id,
			DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
		FROM items i
		JOIN users u ON u.id = i.created_by
		ORDER BY i.created_at DESC
		LIMIT :count OFFSET :offset
	");

	$stmt->bindValue(':count', (int)$count, PDO::PARAM_INT);
	$stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);
	$stmt->execute();

	echo json_encode(['items' => $stmt->fetchAll()]);
	exit;
}

// ---- GET /items/:id ----
if ($method === 'GET' && $id) {
	$stmt = db()->prepare("
		SELECT
			i.id,
			i.title,
			i.content,
			u.username,
			i.created_by AS owner_id,
			DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
		FROM items i
		JOIN users u ON u.id = i.created_by
		WHERE i.id = ?
	");
	$stmt->execute([$id]);
	$row = $stmt->fetch();

	echo json_encode(['item' => $row ?: null]);
	exit;
}

// ---- POST /items ----
if ($method === 'POST' && !$id) {
	if (empty($_SESSION['user_id'])) {
		http_response_code(401);
		echo json_encode(['error' => 'Not logged in']);
		exit;
	}

	$raw = file_get_contents('php://input');
	$data = json_decode($raw, true);

	$title = trim($data['title'] ?? '');
	$content = trim($data['content'] ?? '');

	if ($title === '') {
		http_response_code(400);
		echo json_encode(['error' => 'title is required']);
		exit;
	}
	if ($content === '') {
		http_response_code(400);
		echo json_encode(['error' => 'content is required']);
		exit;
	}

	$userId = (int)$_SESSION['user_id'];

	$stmt = db()->prepare("INSERT INTO items (title, content, created_by) VALUES (?, ?, ?)");
	$stmt->execute([$title, $content, $userId]);
	$newId = db()->lastInsertId();

	$stmt = db()->prepare("
		SELECT
			i.id,
			i.title,
			i.content,
			u.username,
			i.created_by AS owner_id,
			DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
		FROM items i
		JOIN users u ON u.id = i.created_by
		WHERE i.id = ?
	");
	$stmt->execute([$newId]);

	echo json_encode(['item' => $stmt->fetch()]);
	exit;
}

// ---- PUT /items/:id ----
if ($method === 'PUT' && $id) {
	if (empty($_SESSION['user_id'])) {
		http_response_code(401);
		echo json_encode(['error' => 'Not logged in']);
		exit;
	}

	$userId = (int)$_SESSION['user_id'];

	// Ownership check
	$stmt = db()->prepare("SELECT created_by FROM items WHERE id = ? LIMIT 1");
	$stmt->execute([(int)$id]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!$row) {
		http_response_code(404);
		echo json_encode(['error' => 'Item not found']);
		exit;
	}
	if ((int)$row['created_by'] !== $userId) {
		http_response_code(403);
		echo json_encode(['error' => 'Forbidden']);
		exit;
	}

	$raw = file_get_contents('php://input');
	$data = json_decode($raw, true);

	$title = trim($data['title'] ?? '');
	$content = trim($data['content'] ?? '');

	if ($title === '') {
		http_response_code(400);
		echo json_encode(['error' => 'title is required']);
		exit;
	}
	if ($content === '') {
		http_response_code(400);
		echo json_encode(['error' => 'content is required']);
		exit;
	}

	$stmt = db()->prepare("UPDATE items SET title = ?, content = ? WHERE id = ?");
	$stmt->execute([$title, $content, (int)$id]);

	$stmt = db()->prepare("
		SELECT
			i.id,
			i.title,
			i.content,
			u.username,
			i.created_by AS owner_id,
			DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') AS created_at
		FROM items i
		JOIN users u ON u.id = i.created_by
		WHERE i.id = ?
	");
	$stmt->execute([(int)$id]);

	echo json_encode(['item' => $stmt->fetch()]);
	exit;
}

// ---- DELETE /items/:id ----
if ($method === 'DELETE' && $id) {
	if (empty($_SESSION['user_id'])) {
		http_response_code(401);
		echo json_encode(['error' => 'Not logged in']);
		exit;
	}

	$userId = (int)$_SESSION['user_id'];
	$idInt = (int)$id;

	// Ownership check
	$stmt = db()->prepare("SELECT created_by FROM items WHERE id = ? LIMIT 1");
	$stmt->execute([$idInt]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!$row) {
		http_response_code(404);
		echo json_encode(['error' => 'Item not found']);
		exit;
	}
	if ((int)$row['created_by'] !== $userId) {
		http_response_code(403);
		echo json_encode(['error' => 'Forbidden']);
		exit;
	}

	$stmt = db()->prepare("DELETE FROM items WHERE id = ?");
	$stmt->execute([$idInt]);

	echo json_encode(['ok' => true]);
	exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found']);
