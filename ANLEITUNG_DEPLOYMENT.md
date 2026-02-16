# Anleitung zum Bereitstellen (Hosten) der Anwendung

Diese Seite funktioniert als statische Webseite ohne Node.js-Server.

## Schnellstart

Sie finden in diesem Ordner bereits einen Unterordner namens `dist`. Dieser enthält die **fertige Webseite**.

1.  Öffnen Sie den Ordner `dist`.
2.  Kopieren Sie den gesamten Inhalt (die Datei `index.html` und die Ordner `assets/`, `videos/`) auf Ihren Webspace.
3.  Fertig!

## Bearbeiten der Kursinhalte (ohne Neu-Erstellen)

Im Ordner `dist` finden Sie eine Datei namens `courses.js`. In dieser Datei sind alle Kurse, Lektionen und Fragen gespeichert.

*   Sie können diese Datei mit jedem Texteditor öffnen und bearbeiten.
*   Sie können Texte ändern, neue Lektionen hinzufügen oder Video-Links anpassen.
*   Speichern Sie die Datei einfach ab. Wenn Sie die Seite im Browser neu laden, sind die Änderungen sofort sichtbar.
*   **Sie müssen nichts neu kompilieren.**

## Hinweise

*   **Kein Server nötig:** Die Dateien im `dist`-Ordner laufen überall.
*   **Videos:** Videos aus `public/videos/` landen automatisch in `dist/videos/`.
*   **Hash-URLs:** Die Adressen enthalten ein `#` (z.B. `/#/dashboard`). Das ist normal und notwendig.
