# AWO Schulungsplattform (Full Stack PHP/MySQL)

Dies ist eine webbasierte Schulungsplattform mit vollwertiger Datenbank-Anbindung.

## Voraussetzungen

*   Webserver (Apache/Nginx)
*   PHP 8.0+
*   MySQL / MariaDB Datenbank

## Installation

1.  **Dateien hochladen:**
    Laden Sie den gesamten Ordnerinhalt auf Ihren Webspace.

2.  **Datenbank einrichten:**
    *   Erstellen Sie eine neue MySQL-Datenbank.
    *   Importieren Sie die Datei `schema.sql` in diese Datenbank (z.B. via phpMyAdmin).

3.  **Konfiguration:**
    *   Öffnen Sie `api/config.php`.
    *   Tragen Sie Ihre Datenbank-Zugangsdaten ein:
        ```php
        define('DB_HOST', 'localhost');
        define('DB_NAME', 'ihre_datenbank');
        define('DB_USER', 'ihr_benutzer');
        define('DB_PASS', 'ihr_passwort');
        ```

4.  **Starten:**
    Rufen Sie die URL Ihrer Installation auf.

## Admin-Zugang

*   **URL:** `#/admin/login`
*   **Passwort:** `admin` (Standard, änderbar in `js/store.js` -> `loginAdmin`).

## Architektur

*   **Frontend:** Vanilla JS (ES Modules), Tailwind CSS (CDN).
*   **Backend:** PHP (API unter `/api/`), PDO, JSON Responses.
*   **Datenbank:** MySQL.

## Entwicklung

Lokal testen mit PHP Built-in Server:
```bash
php -S localhost:8000
```
(Beachten Sie, dass Sie trotzdem einen laufenden MySQL-Server benötigen und `api/config.php` anpassen müssen).
