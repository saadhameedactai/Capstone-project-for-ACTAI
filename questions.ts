// Entry test question bank: 10 English, 10 Math, 10 Physics = 30 total.
// This file is only ever imported by server-side API routes, so correct
// answers never reach the browser before the test is scored.

export type Question = {
  id: string;
  subject: "English" | "Math" | "Physics";
  question: string;
  options: string[];
  correctIndex: number; // 0-3
};

export const QUESTION_BANK: Question[] = [
  // --- English (10) ---
  { id: "e1", subject: "English", question: "Choose the correctly spelled word.", options: ["Recieve", "Receive", "Receeve", "Receve"], correctIndex: 1 },
  { id: "e2", subject: "English", question: "Synonym of 'Abundant':", options: ["Scarce", "Plentiful", "Empty", "Limited"], correctIndex: 1 },
  { id: "e3", subject: "English", question: "Antonym of 'Optimistic':", options: ["Hopeful", "Pessimistic", "Cheerful", "Positive"], correctIndex: 1 },
  { id: "e4", subject: "English", question: "Identify the correct sentence.", options: ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", "She not like tea."], correctIndex: 2 },
  { id: "e5", subject: "English", question: "'He ___ to school every day.' Fill in the blank.", options: ["go", "goes", "going", "gone"], correctIndex: 1 },
  { id: "e6", subject: "English", question: "The passive voice of 'She writes a letter' is:", options: ["A letter is written by her.", "A letter was written by her.", "A letter writes her.", "She is written a letter."], correctIndex: 0 },
  { id: "e7", subject: "English", question: "Which word is a conjunction?", options: ["Quickly", "Because", "Beautiful", "Table"], correctIndex: 1 },
  { id: "e8", subject: "English", question: "Plural of 'Child':", options: ["Childs", "Childes", "Children", "Childrens"], correctIndex: 2 },
  { id: "e9", subject: "English", question: "Choose the correct article: '___ honest man is respected.'", options: ["A", "An", "The", "No article needed"], correctIndex: 1 },
  { id: "e10", subject: "English", question: "'Punctual' most nearly means:", options: ["Late", "On time", "Careless", "Slow"], correctIndex: 1 },

  // --- Math (10) ---
  { id: "m1", subject: "Math", question: "Solve: 7x = 42. x = ?", options: ["5", "6", "7", "8"], correctIndex: 1 },
  { id: "m2", subject: "Math", question: "Value of 15% of 200:", options: ["20", "25", "30", "35"], correctIndex: 2 },
  { id: "m3", subject: "Math", question: "(a+b)^2 expands to:", options: ["a^2+b^2", "a^2+2ab+b^2", "a^2-2ab+b^2", "2ab"], correctIndex: 1 },
  { id: "m4", subject: "Math", question: "The next number in the series 2, 4, 8, 16, ___:", options: ["24", "28", "32", "36"], correctIndex: 2 },
  { id: "m5", subject: "Math", question: "If a triangle has angles 90° and 45°, the third angle is:", options: ["30°", "45°", "60°", "90°"], correctIndex: 1 },
  { id: "m6", subject: "Math", question: "Square root of 144:", options: ["10", "11", "12", "13"], correctIndex: 2 },
  { id: "m7", subject: "Math", question: "Simplify: 3/4 + 1/4", options: ["1/2", "1", "3/8", "4/8"], correctIndex: 1 },
  { id: "m8", subject: "Math", question: "The area of a rectangle with sides 5 and 8 is:", options: ["13", "40", "45", "35"], correctIndex: 1 },
  { id: "m9", subject: "Math", question: "Solve: 2x + 3 = 11. x = ?", options: ["3", "4", "5", "6"], correctIndex: 1 },
  { id: "m10", subject: "Math", question: "The average of 4, 8, 12 is:", options: ["6", "7", "8", "9"], correctIndex: 2 },

  // --- Physics (10) ---
  { id: "p1", subject: "Physics", question: "SI unit of force is:", options: ["Joule", "Newton", "Watt", "Pascal"], correctIndex: 1 },
  { id: "p2", subject: "Physics", question: "Speed = Distance / ___", options: ["Mass", "Time", "Force", "Volume"], correctIndex: 1 },
  { id: "p3", subject: "Physics", question: "Acceleration due to gravity on Earth is approximately:", options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.2 m/s²"], correctIndex: 1 },
  { id: "p4", subject: "Physics", question: "Which of these is a scalar quantity?", options: ["Velocity", "Force", "Speed", "Displacement"], correctIndex: 2 },
  { id: "p5", subject: "Physics", question: "Ohm's Law is given by:", options: ["V = IR", "P = IV", "F = ma", "E = mc²"], correctIndex: 0 },
  { id: "p6", subject: "Physics", question: "The unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"], correctIndex: 2 },
  { id: "p7", subject: "Physics", question: "Light travels fastest in:", options: ["Water", "Glass", "Vacuum", "Air"], correctIndex: 2 },
  { id: "p8", subject: "Physics", question: "Newton's First Law is also called the law of:", options: ["Action-Reaction", "Inertia", "Gravitation", "Momentum"], correctIndex: 1 },
  { id: "p9", subject: "Physics", question: "Which instrument measures temperature?", options: ["Barometer", "Thermometer", "Ammeter", "Voltmeter"], correctIndex: 1 },
  { id: "p10", subject: "Physics", question: "Kinetic energy formula:", options: ["mgh", "½mv²", "mv", "F/m"], correctIndex: 1 },
];
