<?php
require_once 'db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['type']) || !isset($input['id'])) {
        throw new Exception('Invalid JSON. Missing type or id.');
    }

    $id = (int)$input['id'];
    $type = $input['type']; // course, module, lesson, question, answer

    $table = '';
    switch ($type) {
        case 'course': $table = 'courses'; break;
        case 'module': $table = 'modules'; break;
        case 'lesson': $table = 'lessons'; break;
        case 'question': $table = 'questions'; break;
        case 'answer': $table = 'answers'; break;
        default: throw new Exception('Invalid entity type');
    }

    // Prepare statement (table name cannot be bound)
    // Validate table name is strictly from whitelist above.
    $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(true, ['message' => 'Deleted']);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
?>
