<?php
require_once 'db.php';

try {
    $pdo = getDB();

    // Fetch All Courses
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY id ASC");
    $courses = $stmt->fetchAll();

    // Build the tree
    // Ideally we could fetch everything in one go or use a few queries.
    // Given the scale is likely small, separate queries per level is easiest to read/maintain,
    // though for performance fetching all modules/lessons/etc and mapping in PHP is better.

    // Strategy: Fetch ALL modules, ALL lessons, ALL questions, ALL answers and map them.

    $modulesStmt = $pdo->query("SELECT * FROM modules ORDER BY position ASC");
    $allModules = $modulesStmt->fetchAll();

    $lessonsStmt = $pdo->query("SELECT * FROM lessons ORDER BY position ASC");
    $allLessons = $lessonsStmt->fetchAll();

    $questionsStmt = $pdo->query("SELECT * FROM questions ORDER BY id ASC");
    $allQuestions = $questionsStmt->fetchAll();

    $answersStmt = $pdo->query("SELECT * FROM answers ORDER BY id ASC");
    $allAnswers = $answersStmt->fetchAll();

    // Map Answers to Questions
    $questionsMap = [];
    foreach ($allQuestions as $q) {
        $q['answers'] = [];
        $questionsMap[$q['id']] = $q;
    }
    foreach ($allAnswers as $a) {
        $qId = $a['question_id'];
        if (isset($questionsMap[$qId])) {
            // Frontend expects specific structure
            $questionsMap[$qId]['answers'][] = [
                'id' => (string)$a['id'], // Ensure ID is string for frontend compat? Or keep mixed? Frontend used strings.
                'text' => $a['answer_text'],
                'isCorrect' => (bool)$a['is_correct']
            ];
        }
    }

    // Map Questions to Lessons (grouped by lesson_id)
    $lessonQuestions = [];
    foreach ($questionsMap as $q) {
        $lId = $q['lesson_id'];
        if (!isset($lessonQuestions[$lId])) {
            $lessonQuestions[$lId] = [];
        }
        $lessonQuestions[$lId][] = [
            'id' => (string)$q['id'],
            'text' => $q['question_text'],
            'type' => $q['type'] === 'single' ? 'single-choice' : 'multiple-choice',
            'answers' => $q['answers']
        ];
    }

    // Map Lessons to Modules
    $moduleLessons = [];
    foreach ($allLessons as $l) {
        $mId = $l['module_id'];
        if (!isset($moduleLessons[$mId])) {
            $moduleLessons[$mId] = [];
        }

        $lessonObj = [
            'id' => (string)$l['id'],
            'title' => $l['title'],
            'description' => '', // DB Schema didn't have description for lesson, courses.js did. We can add or ignore.
            'content' => $l['content'],
            'videoUrl' => $l['video_url'],
            'order' => $l['position']
        ];

        // Attach Quiz if questions exist OR if passing_score suggests a quiz context
        if (isset($lessonQuestions[$l['id']]) && count($lessonQuestions[$l['id']]) > 0) {
            $lessonObj['quiz'] = [
                'id' => 'quiz-' . $l['id'],
                'title' => 'Quiz',
                'passingScore' => (int)$l['quiz_passing_score'],
                'questions' => $lessonQuestions[$l['id']]
            ];
        } else {
             // If passing score > 0 but no questions, maybe we still want the quiz structure?
             // Or if logic in editor requires it.
             // Usually undefined quiz is fine.
        }

        $moduleLessons[$mId][] = $lessonObj;
    }

    // Map Modules to Courses
    $courseModules = [];
    foreach ($allModules as $m) {
        $cId = $m['course_id'];
        if (!isset($courseModules[$cId])) {
            $courseModules[$cId] = [];
        }
        $courseModules[$cId][] = [
            'id' => (string)$m['id'],
            'title' => $m['title'],
            'lessons' => isset($moduleLessons[$m['id']]) ? $moduleLessons[$m['id']] : []
        ];
    }

    // Final Course List
    $result = [];
    foreach ($courses as $c) {
        $result[] = [
            'id' => (string)$c['id'],
            'title' => $c['title'],
            'description' => $c['description'],
            'modules' => isset($courseModules[$c['id']]) ? $courseModules[$c['id']] : []
        ];
    }

    jsonResponse(true, $result);

} catch (Exception $e) {
    jsonResponse(false, $e->getMessage());
}
?>
