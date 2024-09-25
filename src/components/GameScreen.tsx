import React, { useEffect, useState, useRef } from "react";
import { Button, TextField } from "@mui/material";
import { getQuizzes, getResult, Quizzes } from "../api";

type Position = {
  x: number;
  y: number;
};

const GameScreen = () => {
  const [cursorPosition, setCursorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [clickPosition, setClickPosition] = useState<Position>({ x: 0, y: 0 });
  const [quizzes, setQuizzes] = useState<Quizzes | undefined>(undefined);
  const [result, setResult] = useState<string>("");
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [textField, setTextField] = useState<string>("");
  const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextField(event.target.value);
  };

  const quiz = quizzes ? quizzes[0] : undefined;

  useEffect(() => {
    (async () => {
      const response = await getQuizzes();
      setQuizzes(response);
    })();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setCursorPosition({ x, y });
      }
    };

    const gameArea = gameAreaRef.current;
    gameArea?.addEventListener("mousemove", handleMouseMove);

    return () => {
      gameArea?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const answerQuestion = async () => {
    if (!quiz) return;
    const response = await getResult(
      quiz.id.toString(),
      clickPosition.x,
      clickPosition.y,
      textField
    );
    if (response === undefined) return;
    setResult(response.is_correct ? "正解" : "不正解");
  };

  const onClickArea = (x: number, y: number, event: React.MouseEvent) => {
    if (!quiz) return;
    event.preventDefault();
    setClickPosition({ x: x, y: y });
    setTextField(quiz.question[x][y]);
  };

  return (
    <div className=" p-4 font-mono">
      <div
        id="game-screen"
        ref={gameAreaRef}
        className="focus:outline-none text-2xl bg-gray-800 text-white p-4 mt-[50px] relative overflow-hidden h-[300px] w-full"
      >
        {quiz &&
          quiz.question.map((row, i) => (
            <div key={i} className="flex mb-2">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className="mr-4 hover:bg-blue-500"
                  onClick={(event) => onClickArea(i, j, event)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        <svg
          id="cursor-overlay"
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            <mask id="hole">
              <rect width="100%" height="100%" fill="white" />
              <ellipse
                cx={cursorPosition.x}
                cy={cursorPosition.y}
                rx="120"
                ry="30"
                fill="black"
              />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="black" mask="url(#hole)" />
        </svg>
      </div>

      <div className="mt-8 space-y-4">
        <div className=" p-4 rounded-md border border-[#3c3c3c]">
          <h3 className="text-xl font-semibold mb-2 ">選択している単語</h3>
          <TextField
            type="text"
            value={textField}
            onChange={handleText}
            disabled={!textField}
          />
        </div>
        <Button onClick={answerQuestion} className="w-full" variant="contained">
          回答
        </Button>
        <div className="p-4 rounded-md border border-[#3c3c3c] h-[100px]">
          <h3 className="text-xl font-semibold mb-2">結果</h3>
          <p className="text-xl font-bold">{result}</p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
