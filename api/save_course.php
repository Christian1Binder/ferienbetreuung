<?php
require_once 'db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        throw new Exception('Invalid JSON');
    }

    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;
    $title = $input['title'] ?? 'Neuer Kurs';
    $description = $input['description'] ?? '';

    if ($id) {
        // Update
        $stmt = $pdo->prepare("UPDATE courses SET title = ?, description = ? WHERE id = ?");
        $stmt->execute([$title, $description, $id]);
        $newId = $id;
    } else {
        // Insert
        $stmt = $pdo->prepare("INSERT INTO courses (title, description) VALUES (?, ?)");
        $stmt->execute([$title, $description]);
        $newId = $pdo->lastInsertId();
    }

    jsonResponse(true, ['id' => (string)$newId]);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
?>
