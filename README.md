# AWO Bezirksjugendwerk Mittelfranken - Online-Lernplattform

Eine modulare Webplattform für Online-Weiterbildungen, entwickelt für das Bezirksjugendwerk der AWO Mittelfranken.
Zunächst konzipiert für die Schulung von Mitarbeitenden der Ferienbetreuung.

## Funktionen

*   **Modularer Aufbau:** Unterstützung für beliebig viele Kurse, Module und Lektionen.
*   **Interaktives Lernen:** Integration von Videos und anschließenden Quizfragen (Single/Multiple Choice).
*   **Fortschrittstracking:** Persistente Speicherung des Lernfortschritts pro Nutzer (LocalStorage).
*   **Zertifikat:** Automatische Erstellung eines PDF-Teilnahmezertifikats nach erfolgreichem Kursabschluss.
*   **Admin-Bereich:** Einfache Verwaltung von Kursinhalten direkt im Browser (Daten werden lokal simuliert/gespeichert).
*   **Responsive Design:** Optimiert für Smartphone, Tablet und Desktop (Mobile First).
*   **Barrierearm:** Klare Struktur, große Buttons, kontrastreiche Farben (AWO Design).

## Projektstruktur

Das Projekt basiert auf React (Vite), TypeScript und Tailwind CSS.

*   `src/components/ui`: Wiederverwendbare UI-Komponenten (Button, Card, Input, ProgressBar).
*   `src/components/layout`: Layout-Komponenten (Header, Sidebar).
*   `src/components/quiz`: Quiz-Logik und Darstellung.
*   `src/pages`: Die verschiedenen Ansichten der App (Welcome, Dashboard, CourseView, LessonView, Certificate, AdminDashboard).
*   `src/store`: Zustand der Anwendung (Zustand Store mit Persistenz).
*   `src/types`: TypeScript Definitionen.
*   `src/data`: Initiale Mock-Daten (Kurs "Ferienbetreuung").
*   `src/utils`: Hilfsfunktionen (z.B. PDF Generierung).

## Installation & Start

Voraussetzung: Node.js (Version 16+ empfohlen).

1.  Repository klonen oder herunterladen.
2.  In das Projektverzeichnis wechseln.
3.  Abhängigkeiten installieren:
    ```bash
    npm install
    ```
4.  Entwicklungsserver starten:
    ```bash
    npm run dev
    ```
5.  Die Anwendung ist unter `http://localhost:5173` erreichbar.

## Nutzung

### Als Teilnehmer
1.  Geben Sie auf der Startseite Ihren Namen und optional Ihre Einrichtung ein.
2.  Im Dashboard sehen Sie Ihre Kurse und den aktuellen Fortschritt.
3.  Wählen Sie einen Kurs und bearbeiten Sie die Module/Lektionen nacheinander.
4.  Nach erfolgreichem Abschluss aller Lektionen können Sie Ihr Zertifikat herunterladen.

### Als Admin
1.  Klicken Sie im Menü auf "Admin".
2.  Hier können Sie Kurstitel, Beschreibungen und Lektionen bearbeiten oder neue hinzufügen.
3.  Änderungen werden lokal im Browser gespeichert (für diese Demo-Version).

## Tech Stack

*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Zustand](https://github.com/pmndrs/zustand) (State Management)
*   [React Router](https://reactrouter.com/) (Routing)
*   [jsPDF](https://github.com/parallax/jsPDF) (PDF Generierung)
*   [Lucide React](https://lucide.dev/) (Icons)

## Design

Die Farben und Typografie orientieren sich am Corporate Design der AWO (Rot #E2001A).
