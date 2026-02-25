<?php
require_once 'db.php';

try {
    $pdo = getDB();
    $input = json_decode(file_get_contents('php://input'), true);

    // This endpoint saves ONE question and its answers.
    // Or multiple? The prompt says "Admin erstellt neue Quizfrage... Frage wird gespeichert".
    // Usually admin sends a list of questions?
    // Let's assume the frontend sends one question object at a time or the lesson editor iterates.
    // The lesson editor in JS manages an array of questions.
    // If I want to save the whole quiz, I might need to iterate.
    // But the prompt says "save_question.php".

    // Input expected: { lesson_id, id (optional), text, type, answers: [...] }

    if (!$input || !isset($input['lesson_id'])) {
        throw new Exception('Invalid JSON or missing lesson_id');
    }

    $pdo->beginTransaction();

    $id = isset($input['id']) && is_numeric($input['id']) ? (int)$input['id'] : null;
    $lessonId = (int)$input['lesson_id'];
    $text = $input['text'] ?? $input['question_text'] ?? '';
    $type = $input['type'] ?? 'single-choice';
    $dbType = ($type === 'multiple-choice') ? 'multiple' : 'single';
    $explanation = $input['explanation'] ?? '';

    if ($id) {
        $stmt = $pdo->prepare("UPDATE questions SET question_text = ?, type = ?, explanation = ? WHERE id = ?");
        $stmt->execute([$text, $dbType, $explanation, $id]);
        $questionId = $id;
    } else {
        $stmt = $pdo->prepare("INSERT INTO questions (lesson_id, question_text, type, explanation) VALUES (?, ?, ?, ?)");
        $stmt->execute([$lessonId, $text, $dbType, $explanation]);
        $questionId = $pdo->lastInsertId();
    }

    // Handle Answers
    // Strategy: Delete all existing answers for this question and re-insert (easiest for sync)
    // OR update if IDs exist.
    // Given the prompt "Admin erstellt neue Quizfrage", creating is key. Updating: users might change answers.
    // Simplest robust way: Delete old, Insert new.

    // Check if answers provided
    if (isset($input['answers']) && is_array($input['answers'])) {
        // Delete old answers if update
        // (If we want to preserve answer IDs for stats, we'd do UPSERT, but user stats in this app are simple JSON)
        // Actually, user stats stored in local storage completedLessons. They don't reference answer IDs, just score.
        // So recreating answers is safe.

        $pdo->prepare("DELETE FROM answers WHERE question_id = ?")->execute([$questionId]);

        $stmtAnswer = $pdo->prepare("INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)");
        foreach ($input['answers'] as $ans) {
            $ansText = $ans['text'] ?? '';
            $isCorrect = !empty($ans['isCorrect']) ? 1 : 0;
            $stmtAnswer->execute([$questionId, $ansText, $isCorrect]);
        }
    }

    $pdo->commit();
    jsonResponse(true, ['id' => (string)$questionId]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse(false, $e->getMessage());
}
?>
