import { useState, useEffect } from "react";
import { getQuizzes, getResult, Quizzes } from "../api";

type Position = {
  x: number;
  y: number;
};

export const GameScreen = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [quizzes, setQuizzes] = useState<Quizzes | undefined>(undefined);
  const [result, setResult] = useState<string>("");

  const quiz = quizzes ? quizzes[0] : undefined;

  const rowLength = quiz ? quiz.question.length : undefined;
  const colLengths = quiz ? quiz.question.map((row) => row.length) : undefined;

  useEffect(() => {
    (async () => {
      const response = await getQuizzes();
      setQuizzes(response);
    })();
  }, []);

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!quizzes || !rowLength || !colLengths) return;
    const key = e.code;

    if (key === "ArrowUp") {
      if (position.y > 0) {
        if (position.x > colLengths[position.y - 1] - 1) {
          setPosition((prev) => ({
            ...prev,
            x: colLengths[position.y - 1] - 1,
            y: position.y - 1,
          }));
        } else {
          setPosition((prev) => ({ ...prev, y: prev.y - 1 }));
        }
      }
    }

    if (key === "ArrowDown") {
      if (position.y < rowLength - 1) {
        if (position.x > colLengths[position.y + 1] - 1) {
          setPosition((prev) => ({
            ...prev,
            x: colLengths[position.y + 1] - 1,
            y: position.y + 1,
          }));
        } else {
          setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
        }
      }
    }

    if (key === "ArrowLeft" && position.x > 0) {
      setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
    }

    if (key === "ArrowRight" && position.x < colLengths[position.y] - 1) {
      setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
    }

    if (key === "Space") {
      answerQuestion();
    }
  };
  const answerQuestion = async () => {
    const response = await getResult(
      quiz!.id.toString(),
      position.x,
      position.y
    );
    if (response === undefined) return;
    console.log(response.is_correct);
    if (response.is_correct) {
      setResult("正解");
    } else {
      setResult("不正解");
    }
  };

  useEffect(() => {
    const element = document.getElementById("game-screen");
    if (element) {
      element.focus();
    }
  }, []);

  return (
    <>
      <div
        id="game-screen"
        onKeyDown={keyDownHandler}
        tabIndex={0}
        className="focus:outline-none text-2xl bg-gray-800 text-white p-4 mt-[100px] text-gray-800"
      >
        {quiz &&
          quiz.question.map((row, i) => (
            <div key={i} className="flex mb-2">
              {row.map((cell, j) => (
                <div key={j} className="mr-4">
                  {cell}
                </div>
              ))}
            </div>
          ))}
      </div>
      <div className="text-2xl">{result}</div>
    </>
  );
};
