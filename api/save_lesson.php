<?php
require_once 'db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['module_id'])) {
        throw new Exception('Invalid JSON or missing module_id');
    }

    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;
    $moduleId = (int)$input['module_id'];
    $title = $input['title'] ?? 'Neue Lektion';
    $content = $input['content'] ?? '';
    $videoUrl = $input['video_url'] ?? $input['videoUrl'] ?? ''; // Handle both casing
    $position = isset($input['position']) ? (int)$input['position'] : (isset($input['order']) ? (int)$input['order'] : 0);

    // Check for quiz passing score update
    $quizPassingScore = 1;
    if (isset($input['quiz']) && isset($input['quiz']['passingScore'])) {
        $quizPassingScore = (int)$input['quiz']['passingScore'];
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE lessons SET title = ?, content = ?, video_url = ?, position = ?, quiz_passing_score = ? WHERE id = ?");
        $stmt->execute([$title, $content, $videoUrl, $position, $quizPassingScore, $id]);
        $newId = $id;
    } else {
        $stmt = $pdo->prepare("INSERT INTO lessons (module_id, title, content, video_url, position, quiz_passing_score) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$moduleId, $title, $content, $videoUrl, $position, $quizPassingScore]);
        $newId = $pdo->lastInsertId();
    }

    jsonResponse(true, ['id' => (string)$newId]);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
?>
