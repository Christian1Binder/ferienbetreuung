<?php
// Simple script to save courses.js
// In a real app, you'd want better authentication/CSRF protection.

header('Content-Type: application/json');

// Check if courses.js is writable
$file = '../courses.js';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Nur POST erlaubt.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Ungültiges JSON.']);
    exit;
}

// Convert back to JSON with pretty print
$jsonString = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// Wrap in window.coursesData = ...
$jsContent = "window.coursesData = " . $jsonString . ";";

if (file_put_contents($file, $jsContent)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Fehler beim Schreiben der Datei. Prüfen Sie die Berechtigungen.']);
}
?>
