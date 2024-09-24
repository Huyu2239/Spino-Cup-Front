import { useState, useEffect } from "react";

type Position = {
  x: number;
  y: number;
};

export const GameScreen = () => {
  const mockData = [
    ["hoge", "hoge", "hoge"],
    ["aaaa", "hoge"],
    ["hoge", "hoge"],
    ["hoge", "hoge", "hoge"],
  ];

  const rowLength = mockData.length;
  const colLengths = mockData.map((row) => row.length);

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

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
  };

  useEffect(() => {
    const element = document.getElementById("game-screen");
    if (element) {
      element.focus();
    }
  }, []);

  return (
    <div
      id="game-screen"
      onKeyDown={keyDownHandler}
      tabIndex={0}
      className="focus:outline-none"
    >
      {mockData.map((row, i) => (
        <div key={i} className="flex">
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                backgroundColor:
                  position.y === i && position.x === j
                    ? "lightblue"
                    : "transparent",
              }}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
