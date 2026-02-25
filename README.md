# AWO Schulungsplattform

Dies ist eine einfache, webbasierte Schulungsplattform, die ohne Node.js oder Build-Prozesse auskommt. Sie läuft auf jedem Standard-Webserver (Apache, Nginx, etc.) mit PHP-Unterstützung.

## Installation / Deployment

1.  **Dateien hochladen:** Laden Sie den gesamten Ordnerinhalt auf Ihren Webspace hoch.
2.  **Berechtigungen:** Stellen Sie sicher, dass die Datei `courses.js` vom Webserver beschrieben werden kann (z.B. CHMOD 664 oder 666, abhängig von Ihrer Serverkonfiguration), damit der Admin-Bereich Änderungen speichern kann.
3.  **Fertig:** Rufen Sie die URL Ihrer Seite auf.

## Admin-Zugang

*   **URL:** `#/admin/login` (oder über den Link "Admin Login" im Footer der Startseite/Sidebar).
*   **Passwort:** `admin` (Standard).
    *   *Sicherheitshinweis:* Ändern Sie das Passwort in `js/store.js` (Funktion `loginAdmin`) und idealerweise auch in `api/save_courses.php` (dort ist aktuell kein Passwortschutz implementiert, nur im Frontend!). Für den produktiven Einsatz wird empfohlen, das Verzeichnis `api/` oder die Datei `save_courses.php` zusätzlich per `.htaccess` oder Serverseitig abzusichern.

## Funktionsweise

*   **Frontend:** HTML, Tailwind CSS (via CDN), Vanilla JavaScript (ES Modules).
*   **Daten:** Die Kursinhalte liegen in der Datei `courses.js`. Diese wird beim Start geladen.
*   **Speichern:** Änderungen im Admin-Bereich werden an `api/save_courses.php` gesendet, welches die `courses.js` Datei überschreibt. Sollte dies fehlschlagen (z.B. keine Schreibrechte oder kein PHP), wird ein Download der Datei angeboten, die Sie dann manuell per FTP hochladen können.

## Ordnerstruktur

*   `index.html`: Startseite.
*   `courses.js`: Datenbank für Kurse, Module und Lektionen.
*   `js/`: JavaScript-Logik (Store, Router, Komponenten).
*   `api/`: Backend-Skripte (PHP).
*   `css/`: Eigene Styles.
*   `videos/`: Speicherort für lokale Videos.
