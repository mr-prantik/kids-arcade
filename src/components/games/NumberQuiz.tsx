// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { useSessionState } from "@/providers/SessionStateProvider";
// import { toast } from "sonner";

// type Problem = {
//   question: string;
//   answer: number;
//   options: number[];
// };

// function generateProblem(): Problem {
//   const operations = ["+", "-", "×"];
//   const op = operations[Math.floor(Math.random() * operations.length)];
//   let a = Math.floor(Math.random() * 10) + 1;
//   let b = Math.floor(Math.random() * 10) + 1;

//   let ans = 0;
//   if (op === "+") ans = a + b;
//   if (op === "-") ans = a - b;
//   if (op === "×") ans = a * b;

//   // generate 3 wrong options
//   const options = new Set<number>([ans]);
//   while (options.size < 4) {
//     let wrong = ans + (Math.floor(Math.random() * 6) - 3); // close distractor
//     if (wrong !== ans) options.add(wrong);
//   }

//   // shuffle
//   const opts = Array.from(options).sort(() => Math.random() - 0.5);

//   return { question: `${a} ${op} ${b}`, answer: ans, options: opts };
// }

// export default function NumberQuiz() {
//   const [problem, setProblem] = useState<Problem | null>(null);
//   const { scores, setScores } = useSessionState();

//   useEffect(() => {
//     setProblem(generateProblem());
//   }, []);

//   const handleAnswer = (opt: number) => {
//     if (!problem) return;
//     if (opt === problem.answer) {
//       toast.success("Correct! 🎉");
//       setScores((prev) => ({ ...prev, numberQuiz: (prev.numberQuiz ?? 0) + 1 }));
//       setProblem(generateProblem());
//     } else {
//       toast.error("Oops, try again!");
//     }
//   };

//   const resetQuiz = () => {
//     setScores((prev) => ({ ...prev, numberQuiz: 0 }));
//     setProblem(generateProblem());
//   };

//   return (
//     <div className="flex flex-col items-center space-y-4 p-6">
//       <h1 className="text-2xl font-bold">Number Quiz</h1>
//       <p className="text-lg">Score: {scores?.numberQuiz ?? 0}</p>

//       {problem && (
//         <div className="flex flex-col items-center space-y-4">
//           <p className="text-xl font-semibold">{problem.question} = ?</p>
//           <div className="grid grid-cols-2 gap-4">
//             {problem.options.map((opt, i) => (
//               <Button
//                 key={i}
//                 onClick={() => handleAnswer(opt)}
//                 className="text-lg py-6"
//               >
//                 {opt}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}

//       <Button variant="outline" onClick={resetQuiz}>
//         🔄 Reset Quiz
//       </Button>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSessionState } from "@/providers/SessionStateProvider";
import { toast } from "sonner";

type Problem = {
  question: string;
  answer: number;
  options: number[];
};

function generateProblem(): Problem {
  const operations = ["+", "-", "×"];
  const op = operations[Math.floor(Math.random() * operations.length)];

  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;

  let ans = 0;
  if (op === "+") ans = a + b;
  if (op === "-") ans = a - b;
  if (op === "×") ans = a * b;

  // generate 3 wrong options
  const options = new Set<number>([ans]);
  while (options.size < 4) {
    const wrong = ans + (Math.floor(Math.random() * 6) - 3); // close distractor
    if (wrong !== ans) options.add(wrong);
  }

  // shuffle
  const opts = Array.from(options).sort(() => Math.random() - 0.5);

  return { question: `${a} ${op} ${b}`, answer: ans, options: opts };
}

export default function NumberQuiz() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const { scores, incScore, resetScore, getScore } = useSessionState();

  useEffect(() => {
    setProblem(generateProblem());
  }, []);

  const handleAnswer = (opt: number) => {
    if (!problem) return;
    if (opt === problem.answer) {
      toast.success("Correct! 🎉");
      incScore("numberQuiz", 1); // ✅ use incScore instead of setScores
      setProblem(generateProblem());
    } else {
      toast.error("Oops, try again!");
    }
  };

  const resetQuiz = () => {
    resetScore("numberQuiz"); // ✅ use resetScore instead of setScores
    setProblem(generateProblem());
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">Number Quiz</h1>
      <p className="text-lg">Score: {getScore("numberQuiz")}</p>

      {problem && (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl font-semibold">{problem.question} = ?</p>
          <div className="grid grid-cols-2 gap-4">
            {problem.options.map((opt, i) => (
              <Button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="text-lg py-6"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Button variant="outline" onClick={resetQuiz}>
        🔄 Reset Quiz
      </Button>
    </div>
  );
}


