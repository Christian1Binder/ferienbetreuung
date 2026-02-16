# Anleitung zum Einbinden von Videos

Diese Anleitung erklärt Schritt für Schritt, wie Sie eigene Videos in die Lernplattform einfügen können. Sie müssen kein Programmierer sein, um das zu tun.

## 1. Video vorbereiten

*   **Format:** Das Video muss im Format **.mp4**, **.webm** oder **.ogg** vorliegen. Das gängigste Format ist **.mp4**.
*   **Dateiname:** Geben Sie der Videodatei einen einfachen Namen ohne Leerzeichen oder Sonderzeichen (z.B. `sicherheit.mp4` statt `Sicherheit am Arbeitsplatz v2.mp4`).

## 2. Video ablegen

1.  Öffnen Sie den Projektordner auf Ihrem Computer.
2.  Navigieren Sie in den Unterordner `public`.
3.  Dort finden Sie nun einen neuen Ordner namens `videos`.
4.  Kopieren Sie Ihre Videodatei in diesen Ordner (`public/videos/`).

## 3. Video verlinken

Damit das Video in einer Lektion angezeigt wird, müssen wir der Plattform sagen, wo es liegt.
Da Sie die fertig kompilierte Version nutzen, machen Sie das in der Datei `courses.json` im `dist`-Ordner (oder im Hauptverzeichnis).

1.  Öffnen Sie die Datei `courses.json` mit einem Texteditor (z.B. Notepad, TextEdit oder VS Code).
2.  Suchen Sie die Lektion, zu der Sie das Video hinzufügen möchten. Suchen Sie nach dem Titel der Lektion (z.B. "Mittagessen und Pausen").
3.  In dem Block für diese Lektion finden Sie eine Zeile, die so aussieht:
    ```json
    "videoUrl": "",
    ```
    oder vielleicht:
    ```typescript
    videoUrl: 'https://www.youtube.com/embed/...',
    ```

4.  Ändern Sie diese Zeile so, dass sie auf Ihr Video zeigt. Verwenden Sie den Pfad `videos/` (ohne führenden Schrägstrich), damit es auch in Unterordnern funktioniert.

    **Beispiel:** Wenn Ihre Datei `sicherheit.mp4` heißt:
    ```json
    "videoUrl": "videos/sicherheit.mp4",
    ```

5.  Speichern Sie die Datei.

## 4. Testen

Starten Sie die Anwendung neu oder aktualisieren Sie die Seite im Browser. Wenn Sie nun zur entsprechenden Lektion navigieren, sollte Ihr Video dort erscheinen und abspielbar sein.

## Zusammenfassung der Pfade

*   **Speicherort der Datei:** `public/videos/mein-video.mp4`
*   **Eintrag in der Datei:** `videos/mein-video.mp4`

---
*Hinweis: Wenn Sie YouTube-Videos einbinden möchten, können Sie an der gleichen Stelle einfach den YouTube-Link einfügen (z.B. `https://www.youtube.com/embed/VIDEO_ID`).*
