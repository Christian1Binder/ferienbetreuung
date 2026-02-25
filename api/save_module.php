<?php
require_once 'db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['course_id'])) {
        throw new Exception('Invalid JSON or missing course_id');
    }

    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;
    $courseId = (int)$input['course_id'];
    $title = $input['title'] ?? 'Neues Modul';
    $position = isset($input['position']) ? (int)$input['position'] : 0;

    if ($id) {
        $stmt = $pdo->prepare("UPDATE modules SET title = ?, position = ? WHERE id = ?");
        $stmt->execute([$title, $position, $id]);
        $newId = $id;
    } else {
        $stmt = $pdo->prepare("INSERT INTO modules (course_id, title, position) VALUES (?, ?, ?)");
        $stmt->execute([$courseId, $title, $position]);
        $newId = $pdo->lastInsertId();
    }

    jsonResponse(true, ['id' => (string)$newId]);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
?>
