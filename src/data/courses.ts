import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'ferienbetreuung',
    title: 'Ferienbetreuung',
    description: 'Schulung für Mitarbeitende der Ferienbetreuung des Bezirksjugendwerks der AWO Mittelfranken.',
    modules: [
      {
        id: 'modul-1',
        title: 'Tagesablauf',
        lessons: [
          {
            id: 'lesson-1-1',
            order: 1,
            title: 'Begrüßung und Ankunft',
            description: 'Wie gestalten wir den Start in den Tag für die Kinder und Eltern?',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
            content: 'Der erste Eindruck zählt. Seien Sie pünktlich und freundlich.',
            quiz: {
              id: 'quiz-1-1',
              title: 'Quiz: Ankunft',
              passingScore: 1,
              questions: [
                {
                  id: 'q-1-1-1',
                  text: 'Was ist bei der Ankunft der Kinder am wichtigsten?',
                  type: 'single-choice',
                  answers: [
                    { id: 'a1', text: 'Die Kinder sofort zum Spielen schicken', isCorrect: false },
                    { id: 'a2', text: 'Persönliche Begrüßung und Anwesenheitsliste führen', isCorrect: true },
                    { id: 'a3', text: 'Kaffee trinken', isCorrect: false }
                  ]
                }
              ]
            }
          },
          {
            id: 'lesson-1-2',
            order: 2,
            title: 'Mittagessen und Pausen',
            description: 'Ablauf der Mahlzeiten und Pausengestaltung.',
            videoUrl: '',
            content: 'Das Mittagessen ist eine wichtige soziale Zeit.',
            quiz: {
              id: 'quiz-1-2',
              title: 'Quiz: Mittagessen',
              passingScore: 2,
              questions: [
                 {
                  id: 'q-1-2-1',
                  text: 'Wer teilt das Essen aus?',
                  type: 'single-choice',
                  answers: [
                    { id: 'a1', text: 'Die Kinder selbst', isCorrect: false },
                    { id: 'a2', text: 'Die Betreuer unter Einhaltung der Hygienevorschriften', isCorrect: true }
                  ]
                },
                {
                  id: 'q-1-2-2',
                  text: 'Was tun bei Allergien?',
                  type: 'multiple-choice',
                  answers: [
                    { id: 'a1', text: 'Ignorieren', isCorrect: false },
                    { id: 'a2', text: 'Liste prüfen', isCorrect: true },
                    { id: 'a3', text: 'Alternativessen anbieten', isCorrect: true }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'modul-2',
        title: 'Rechte und Pflichten',
        lessons: [
          {
            id: 'lesson-2-1',
            order: 1,
            title: 'Aufsichtspflicht',
            description: 'Grundlagen der Aufsichtspflicht.',
            videoUrl: '',
            content: 'Sie haben die Verantwortung für die Ihnen anvertrauten Kinder.',
            quiz: {
              id: 'quiz-2-1',
              title: 'Quiz: Aufsichtspflicht',
              passingScore: 1,
              questions: [
                {
                  id: 'q-2-1-1',
                  text: 'Wann endet die Aufsichtspflicht?',
                  type: 'single-choice',
                  answers: [
                    { id: 'a1', text: 'Wenn ich Pause mache', isCorrect: false },
                    { id: 'a2', text: 'Wenn das Kind abgeholt wurde', isCorrect: true }
                  ]
                }
              ]
            }
          }
        ]
      },
      {
        id: 'modul-3',
        title: 'Erste Hilfe',
        lessons: [
          {
            id: 'lesson-3-1',
            order: 1,
            title: 'Verhalten im Notfall',
            description: 'Die wichtigsten Schritte bei einem Unfall.',
            videoUrl: '',
            content: 'Ruhe bewahren und Notruf absetzen.',
            quiz: {
              id: 'quiz-3-1',
              title: 'Quiz: Erste Hilfe',
              passingScore: 1,
              questions: [
                {
                  id: 'q-3-1-1',
                  text: 'Welche Nummer hat der Notruf?',
                  type: 'single-choice',
                  answers: [
                    { id: 'a1', text: '110', isCorrect: false },
                    { id: 'a2', text: '112', isCorrect: true }
                  ]
                }
              ]
            }
          }
        ]
      }
    ]
  }
];
