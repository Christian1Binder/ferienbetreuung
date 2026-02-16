# Anleitung zum Bereitstellen (Hosten) der Anwendung

Diese Seite funktioniert als statische Webseite ohne Node.js-Server.

## Schnellstart

Sie finden in diesem Ordner bereits einen Unterordner namens `dist`. Dieser enthält die **fertige Webseite**.

1.  Öffnen Sie den Ordner `dist`.
2.  Kopieren Sie den gesamten Inhalt (die Datei `index.html` und die Ordner `assets/`, `videos/`) auf Ihren Webspace.
3.  Fertig!

## Falls Sie Änderungen vornehmen (optional)

Wenn Sie den Quellcode (die `.tsx`-Dateien) bearbeiten, müssen Sie die Seite neu erstellen:

1.  Öffnen Sie ein Terminal im Projektordner.
2.  Führen Sie `npm run build` aus.
3.  Der Ordner `dist` wird aktualisiert.

## Hinweise

*   **Kein Server nötig:** Die Dateien im `dist`-Ordner laufen überall.
*   **Videos:** Videos aus `public/videos/` landen automatisch in `dist/videos/`.
*   **Hash-URLs:** Die Adressen enthalten ein `#` (z.B. `/#/dashboard`). Das ist normal und notwendig.
