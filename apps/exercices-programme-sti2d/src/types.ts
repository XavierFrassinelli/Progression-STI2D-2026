export type Subject = 'AC' | 'ITEC' | 'SIN' | 'EE' | '2I2D';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Exercise {
  title: string;
  subject: Subject;
  topic: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  questions: Question[];
}
