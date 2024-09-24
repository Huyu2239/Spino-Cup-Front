import { useState, useEffect } from "react";
import { getQuizzes } from "../api";

type Position = {
  x: number;
  y: number;
};

export const GameScreen = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [result, setResult] = useState<string>("");
  const mockData = [
    ["hoge", "hoge", "hoge"],
    ["aaaa", "hoge"],
    ["hoge", "hoge"],
    ["hoge", "hoge", "hoge"],
  ];

  const rowLength = mockData.length;
  const colLengths = mockData.map((row) => row.length);

  const onClick = async () => {
    const response = await getQuizzes();
    console.log(response);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
  const answerQuestion = () => {
    let ans = { x: 1, y: 1 };
    if (position.x === ans.x && position.y === ans.y) {
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
        className="focus:outline-none text-2xl bg-gray-800 text-white p-4"
      >
        {mockData.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={j}
                style={{
                  backgroundColor:
                    position.y === i && position.x === j
                      ? "blue"
                      : "transparent",
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="text-2xl">{result}</div>
      <button onClick={onClick}>button</button>
    </>
  );
};
