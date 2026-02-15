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

Damit das Video in einer Lektion angezeigt wird, müssen wir der Plattform sagen, wo es liegt. Das machen wir in der Datei `src/data/courses.ts`.

1.  Öffnen Sie die Datei `src/data/courses.ts` mit einem Texteditor (z.B. Notepad, TextEdit oder VS Code).
2.  Suchen Sie die Lektion, zu der Sie das Video hinzufügen möchten. Suchen Sie nach dem Titel der Lektion (z.B. "Mittagessen und Pausen").
3.  In dem Block für diese Lektion finden Sie eine Zeile, die so aussieht:
    ```typescript
    videoUrl: '',
    ```
    oder vielleicht:
    ```typescript
    videoUrl: 'https://www.youtube.com/embed/...',
    ```

4.  Ändern Sie diese Zeile so, dass sie auf Ihr Video zeigt. Der Pfad beginnt immer mit `/videos/`.

    **Beispiel:** Wenn Ihre Datei `sicherheit.mp4` heißt:
    ```typescript
    videoUrl: '/videos/sicherheit.mp4',
    ```

5.  Speichern Sie die Datei.

## 4. Testen

Starten Sie die Anwendung neu oder aktualisieren Sie die Seite im Browser. Wenn Sie nun zur entsprechenden Lektion navigieren, sollte Ihr Video dort erscheinen und abspielbar sein.

## Zusammenfassung der Pfade

*   **Speicherort der Datei:** `public/videos/mein-video.mp4`
*   **Eintrag in der Datei:** `/videos/mein-video.mp4`

---
*Hinweis: Wenn Sie YouTube-Videos einbinden möchten, können Sie an der gleichen Stelle einfach den YouTube-Link einfügen (z.B. `https://www.youtube.com/embed/VIDEO_ID`).*
