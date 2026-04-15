/** MCQ mock tests: 20 questions each, Easy (1–7), Medium (8–14), Hard (15–20). correctAnswer: 0–3 */

export type Difficulty = "easy" | "medium" | "hard";

export type MockQuestion = {
  id: number;
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
};

export type MockTrackId = "nonTechnical" | "technical";

export const PASS_PERCENT = 50;
export const MAX_ATTEMPTS = 3;
export const QUESTION_COUNT = 20;

/** Non-technical / 12th+ — aptitude, mindset, basic digital & AI awareness */
export const NON_TECHNICAL_QUESTIONS: MockQuestion[] = [
  {
    id: 1,
    difficulty: "easy",
    question: "In a career context, “IT” usually stands for:",
    options: [
      "Information Technology",
      "Internet Traffic",
      "International Trade",
      "Internal Training",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    difficulty: "easy",
    question: "Which best describes Artificial Intelligence (AI) in simple terms?",
    options: [
      "Machines or software that can learn patterns and help make decisions",
      "Only robots used in car factories",
      "A type of computer virus",
      "The same as a regular Excel spreadsheet",
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    difficulty: "easy",
    question: "Why is consistent practice important when learning a new skill?",
    options: [
      "It builds muscle memory and deep understanding over time",
      "It is only needed for sports, not careers",
      "Once is enough if you watch enough videos",
      "It replaces the need for any mentor",
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    difficulty: "easy",
    question: "A strong reason to learn tech skills today is:",
    options: [
      "Many jobs use digital tools; tech literacy opens more options",
      "Paper-only work will dominate the next decade",
      "You must memorize every programming language",
      "English is no longer needed in tech",
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    difficulty: "easy",
    question: "What is a realistic expectation from a serious mentorship program?",
    options: [
      "Guidance, accountability, and a structured path — outcomes still depend on your effort",
      "A guaranteed job offer from any company",
      "No homework or assignments",
      "Success without changing daily habits",
    ],
    correctAnswer: 0,
  },
  {
    id: 6,
    difficulty: "easy",
    question: "“Open-source software” generally means:",
    options: [
      "The source code is available for others to view and often contribute to",
      "Software that works only offline",
      "Software that never needs updates",
      "Software that is always free of bugs",
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    difficulty: "easy",
    question: "When learning something difficult, the healthiest mindset is:",
    options: [
      "Break it into steps, ask for help, and improve bit by bit",
      "Quit if it is not easy in the first week",
      "Compare only to others, never to your past self",
      "Avoid writing notes or tracking progress",
    ],
    correctAnswer: 0,
  },
  {
    id: 8,
    difficulty: "medium",
    question: "Why might someone use a strong password and two-factor authentication (2FA)?",
    options: [
      "To reduce the risk of account takeover and data theft",
      "Because slow internet requires it",
      "Only banks need passwords",
      "To make logging in impossible for yourself",
    ],
    correctAnswer: 0,
  },
  {
    id: 9,
    difficulty: "medium",
    question: "Cloud storage (e.g. Drive, Dropbox) mainly helps with:",
    options: [
      "Accessing files from multiple devices and backing up data",
      "Replacing the need to ever learn anything",
      "Guaranteeing files can never be deleted",
      "Removing all privacy concerns automatically",
    ],
    correctAnswer: 0,
  },
  {
    id: 10,
    difficulty: "medium",
    question: "Bias in AI models can appear because:",
    options: [
      "Training data and design choices can reflect real-world imbalances",
      "AI is always 100% random",
      "AI only runs on Apple devices",
      "Bias exists only in hardware, never in data",
    ],
    correctAnswer: 0,
  },
  {
    id: 11,
    difficulty: "medium",
    question: "A good way to set a 6-month career goal is to:",
    options: [
      "Define one clear outcome, weekly actions, and how you will measure progress",
      "Keep it vague so no one can judge you",
      "Copy someone else’s goal without context",
      "Plan only the first day and ignore the rest",
    ],
    correctAnswer: 0,
  },
  {
    id: 12,
    difficulty: "medium",
    question: "If you get stuck on a problem for hours, what is usually best first?",
    options: [
      "Take a short break, then try a smaller sub-problem or seek a hint",
      "Never ask anyone for help",
      "Assume you are “not made for tech”",
      "Only read social media for motivation",
    ],
    correctAnswer: 0,
  },
  {
    id: 13,
    difficulty: "medium",
    question: "English + Hindi/Hinglish mix in calls can help when:",
    options: [
      "You understand concepts better in your comfortable language",
      "You want to avoid all documentation",
      "You refuse to ever read in English",
      "You only want entertainment, not learning",
    ],
    correctAnswer: 0,
  },
  {
    id: 14,
    difficulty: "medium",
    question: "Phishing attempts often try to:",
    options: [
      "Trick you into sharing passwords or OTPs via fake links or urgency",
      "Speed up your internet connection",
      "Install official Windows updates only",
      "Improve your typing speed",
    ],
    correctAnswer: 0,
  },
  {
    id: 15,
    difficulty: "hard",
    question: "You committed to 90 minutes of focused study daily but missed 4 days this week. Best response:",
    options: [
      "Reset: start tomorrow with a smaller, realistic block and track streaks honestly",
      "Give up the goal entirely",
      "Study 10 hours in one day to “compensate” with burnout risk",
      "Blame the mentor only",
    ],
    correctAnswer: 0,
  },
  {
    id: 16,
    difficulty: "hard",
    question: "Someone offers “₹50,000 salary in the US remote job” with no interview and an upfront fee. You should:",
    options: [
      "Treat it as highly suspicious; verify company, role, and never pay random upfront fees",
      "Pay immediately to not lose the chance",
      "Share your Aadhaar and OTP in chat for speed",
      "Assume all WhatsApp job ads are real",
    ],
    correctAnswer: 0,
  },
  {
    id: 17,
    difficulty: "hard",
    question: "Long-term growth in tech usually depends more on:",
    options: [
      "Consistency, communication, problem-solving, and learning how to learn",
      "Only your college brand from 10 years ago",
      "Memorizing one framework forever",
      "Avoiding all feedback",
    ],
    correctAnswer: 0,
  },
  {
    id: 18,
    difficulty: "hard",
    question: "If AI tools can generate code snippets, your edge becomes:",
    options: [
      "Understanding requirements, debugging, system thinking, and responsible use",
      "Never learning fundamentals",
      "Copy-pasting without reading",
      "Assuming AI never makes mistakes",
    ],
    correctAnswer: 0,
  },
  {
    id: 19,
    difficulty: "hard",
    question: "You disagree with mentor feedback that feels harsh. A mature step is:",
    options: [
      "Ask clarifying questions, reflect, and test the advice on a small task",
      "Quit the program the same day",
      "Post private chats publicly",
      "Ignore all feedback silently forever",
    ],
    correctAnswer: 0,
  },
  {
    id: 20,
    difficulty: "hard",
    question: "Why might a program require “serious candidates only”?",
    options: [
      "Limited mentor time; execution-heavy work needs commitment and respect for process",
      "To reject everyone automatically",
      "Because beginners are never welcome",
      "Only people with 10+ years experience can apply",
    ],
    correctAnswer: 0,
  },
];

/** Technical / experienced — CS fundamentals, tools, and reasoning */
export const TECHNICAL_QUESTIONS: MockQuestion[] = [
  {
    id: 1,
    difficulty: "easy",
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Process",
      "Host Table Transport Packet",
      "Hyperlink Tracking Program",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    difficulty: "easy",
    question: "Which structure follows LIFO (Last In, First Out)?",
    options: ["Stack", "Queue", "Array", "Hash map"],
    correctAnswer: 0,
  },
  {
    id: 3,
    difficulty: "easy",
    question: "In Git, what is a commit?",
    options: [
      "A snapshot of your repository at a point in time",
      "A remote server only",
      "A merge conflict resolver",
      "A type of database lock",
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    difficulty: "easy",
    question: "Which HTTP method is most appropriate for fetching a resource without side effects?",
    options: ["GET", "POST", "DELETE", "PATCH"],
    correctAnswer: 0,
  },
  {
    id: 5,
    difficulty: "easy",
    question: "What is the primary role of an operating system?",
    options: [
      "Manage hardware resources and provide services to applications",
      "Only compile Java code",
      "Host only one application at a time always",
      "Replace the need for databases",
    ],
    correctAnswer: 0,
  },
  {
    id: 6,
    difficulty: "easy",
    question: "Big-O notation mainly describes:",
    options: [
      "How runtime or space grows with input size",
      "The exact milliseconds of a program",
      "Only memory used by the OS",
      "Number of lines of code",
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    difficulty: "easy",
    question: "JSON is commonly used for:",
    options: [
      "Structured data exchange between systems, often in APIs",
      "Only image compression",
      "CPU scheduling",
      "Disk defragmentation",
    ],
    correctAnswer: 0,
  },
  {
    id: 8,
    difficulty: "medium",
    question: "Which SQL clause filters rows?",
    options: ["WHERE", "SELECT", "JOIN", "ORDER BY"],
    correctAnswer: 0,
  },
  {
    id: 9,
    difficulty: "medium",
    question: "REST APIs often use which format for request/response bodies?",
    options: ["JSON", "BMP images", "WAV audio", "EXE binaries"],
    correctAnswer: 0,
  },
  {
    id: 10,
    difficulty: "medium",
    question: "A primary key in a relational table should be:",
    options: [
      "Unique (and typically non-null) for each row",
      "Always a floating-point number",
      "Duplicated across all rows",
      "Optional for every row",
    ],
    correctAnswer: 0,
  },
  {
    id: 11,
    difficulty: "medium",
    question: "TCP differs from UDP mainly in that TCP is:",
    options: [
      "Connection-oriented and provides reliable delivery",
      "Always faster with no overhead",
      "Unable to work on the internet",
      "Only for DNS",
    ],
    correctAnswer: 0,
  },
  {
    id: 12,
    difficulty: "medium",
    question: "In object-oriented programming, encapsulation means:",
    options: [
      "Hiding internal state and exposing controlled access",
      "Writing only procedural code",
      "Using only global variables",
      "Deleting unused files",
    ],
    correctAnswer: 0,
  },
  {
    id: 13,
    difficulty: "medium",
    question: "Which search runs in O(log n) time on a sorted array?",
    options: ["Binary search", "Linear search", "Random search", "Bubble search"],
    correctAnswer: 0,
  },
  {
    id: 14,
    difficulty: "medium",
    question: "A race condition in concurrent programs happens when:",
    options: [
      "Outcome depends on timing/order of uncontrolled accesses to shared state",
      "You use only one thread",
      "The CPU is idle",
      "You compile with optimizations",
    ],
    correctAnswer: 0,
  },
  {
    id: 15,
    difficulty: "hard",
    question: "Idempotency in HTTP APIs is most associated with:",
    options: [
      "Repeating the same request has the same effect as doing it once (for safe operations)",
      "Always deleting data",
      "Never using POST",
      "Encrypting passwords in the browser only",
    ],
    correctAnswer: 0,
  },
  {
    id: 16,
    difficulty: "hard",
    question: "CAP theorem (simplified) forces distributed systems to trade off between:",
    options: [
      "Consistency, Availability, and Partition tolerance",
      "CPU, RAM, and GPU",
      "HTTP, FTP, and SMTP",
      "Compile time and runtime only",
    ],
    correctAnswer: 0,
  },
  {
    id: 17,
    difficulty: "hard",
    question: "Why might you add an index to a database column used in frequent WHERE clauses?",
    options: [
      "To speed up lookups (with tradeoffs on writes/storage)",
      "To automatically fix bad queries",
      "To remove the need for backups",
      "To double storage for every row always",
    ],
    correctAnswer: 0,
  },
  {
    id: 18,
    difficulty: "hard",
    question: "Microservices vs monolith — a common downside of microservices is:",
    options: [
      "More operational complexity (networking, deployment, observability)",
      "Always slower than monoliths in every case",
      "Impossible to scale",
      "No need for APIs",
    ],
    correctAnswer: 0,
  },
  {
    id: 19,
    difficulty: "hard",
    question: "When debugging production, you should usually:",
    options: [
      "Reproduce, narrow scope, check logs/metrics, and change one thing at a time",
      "Restart servers randomly without evidence",
      "Deploy untested fixes directly on Friday evening",
      "Disable monitoring to reduce noise",
    ],
    correctAnswer: 0,
  },
  {
    id: 20,
    difficulty: "hard",
    question: "JWTs are often used for:",
    options: [
      "Stateless authentication claims between client and server (with proper validation)",
      "Storing large binary files",
      "Replacing HTTPS",
      "Guaranteeing encryption without TLS",
    ],
    correctAnswer: 0,
  },
];

export function getQuestionsForTrack(track: MockTrackId): MockQuestion[] {
  return track === "technical" ? TECHNICAL_QUESTIONS : NON_TECHNICAL_QUESTIONS;
}

/** Rotate options so correct index varies by question id (avoids “always pick A”). */
export function questionsForDisplay(track: MockTrackId): MockQuestion[] {
  return getQuestionsForTrack(track).map((q) => {
    const shift = q.id % 4;
    const o = q.options;
    const rotated: [string, string, string, string] = [
      o[(0 + shift) % 4],
      o[(1 + shift) % 4],
      o[(2 + shift) % 4],
      o[(3 + shift) % 4],
    ];
    const newCorrect = ((q.correctAnswer - shift) % 4 + 4) % 4;
    return {
      ...q,
      options: rotated,
      correctAnswer: newCorrect as 0 | 1 | 2 | 3,
    };
  });
}

export function scoreAnswers(questions: MockQuestion[], selected: (number | null)[]): number {
  let correct = 0;
  for (let i = 0; i < questions.length; i++) {
    if (selected[i] === questions[i].correctAnswer) correct++;
  }
  return correct;
}
