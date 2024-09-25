import React, { useEffect, useState, useRef } from "react";
import { getQuizzes, getResult, Quizzes } from "../api";
import { Box, Typography, Button, Paper } from "@mui/material";

type Position = {
  x: number;
  y: number;
};

export const GameScreen = () => {
  const [cursorPosition, setCursorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [clickPosition, setClickPosition] = useState<Position>({ x: 0, y: 0 });
  const [quizzes, setQuizzes] = useState<Quizzes | undefined>(undefined);
  const [result, setResult] = useState<string>("");
  const gameAreaRef = useRef<HTMLDivElement>(null);

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
      clickPosition.y
    );
    if (response === undefined) return;
    setResult(response.is_correct ? "正解" : "不正解");
  };

  const onClickArea = (x: number, y: number, event: React.MouseEvent) => {
    event.preventDefault();
    setClickPosition({ x: x, y: y });
  };

  return (
    <>
      <div
        id="game-screen"
        ref={gameAreaRef}
        className="focus:outline-none text-2xl bg-gray-800 text-white p-4 mt-[100px] relative overflow-hidden h-[300px] w-full"
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
      <Box className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg shadow-lg">
        <Paper elevation={2} className="p-4 mb-4 w-full text-center">
          <Typography
            variant="h5"
            component="h3"
            className="text-2xl font-semibold"
          >
            選択している単語
          </Typography>
          <Typography variant="h6" className="text-xl font-bold mt-2">
            {quiz?.question[clickPosition.x][clickPosition.y]}
          </Typography>
        </Paper>

        <Button
          variant="contained"
          onClick={answerQuestion}
          className="mb-4 bg-blue-600 text-white hover:bg-blue-500 transition duration-300 w-full"
        >
          回答
        </Button>

        <Paper elevation={2} className="p-4 w-full text-center mt-4">
          <Typography
            variant="h5"
            component="h3"
            className="text-2xl font-semibold"
          >
            結果
          </Typography>
          <Typography variant="h6" className="text-xl font-bold mt-2">
            {result}
          </Typography>
        </Paper>
      </Box>
    </>
  );
};
