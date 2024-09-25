import React, { useEffect, useState, useRef } from "react";
import { Button, TextField } from "@mui/material";
import { getQuizzes, getResult, Quizzes } from "../api";
import useCodeExecutor from "../hooks/useCodeExecutor";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parse } from "acorn";
import CodeEditor from "./CodeEditor";
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

  const { executeCode, executionResult } = useCodeExecutor();

  const quiz = quizzes ? quizzes[0] : undefined;

  // const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTextField(event.target.value);
  //   const cloneQuestion = [...structuredClone(quiz!).question];
  //   cloneQuestion[clickPosition.x][clickPosition.y] = event.target.value;
  //   const newUserCode = cloneQuestion.flat().join(" ");
  //   console.log("newUserCode", event.target.value);
  //   setUserCode(newUserCode);
  // };

  const [userCode, setUserCode] = useState<string>(
    quiz ? quiz.code : ""
  );
  let answer;
  let ast = "";
  let answerAst = "";
  // if (quiz) {
  //   answer = quiz.question
  //     .flat()
  //     .map((word) =>
  //       word === "console.log(evenNumbers.lenght);"
  //         ? "console.log(evenNumbers.length);"
  //         : word
  //     )
  //     .join(" ");
  //   ast = JSON.stringify(parse(userCode), null, 2);
  //   answerAst = JSON.stringify(parse(answer), null, 2);
  // }

  useEffect(() => {
    (async () => {
      const response = await getQuizzes();
      setQuizzes(response);
      if (response) {

        console.log("response", response[0].code);
        setUserCode(response[0].code);

      }
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

  useEffect(() => {
    if (!quiz) return;

    executeCode(userCode);
  }, []);

  const answerQuestion = async () => {
    if (!quiz) return;
    executeCode(quiz.pre_code + userCode);

    setResult(executionResult.logs.join(" ") == quiz.output_sample ? "正解" : "不正解")
    
    // const response = await getResult(
    //   quiz.id.toString(),
    //   clickPosition.y,
    //   clickPosition.x,
    //   textField
    // );
    // if (response === undefined) return;
    // // setResult(response.is_correct ? "正解" : "不正解");
    console.log(ast === answerAst);


    //setResult(ast === answerAst ? "正解" : "不正解");
  };

  const onClickArea = (x: number, y: number, event: React.MouseEvent) => {
    if (!quiz) return;
    event.preventDefault();
    setClickPosition({ x: x, y: y });
    setTextField(quiz.question[x][y]);
  };

  return (
    <div className="flex max-h-screen">
      {/* {ast && <pre>{ast}</pre>} */}
      <div className="font-mono w-[50%] mx-2 overflow-y-scroll ">
        <div className=" p-4 rounded-md border border-[#3c3c3c]">
          <h3 className="text-xl font-semibold mb-2 ">エラー内容</h3>

          <div>
            {executionResult &&
              executionResult.logs
                .filter((log, i) => executionResult.logs.indexOf(log) === i)
                .map((log, i) => <p key={i}>{log}</p>)}
            {executionResult.error && <p>{executionResult.error}</p>}
          </div>
        </div>
        <div
          id="game-screen"
          ref={gameAreaRef}
          className="focus:outline-none text-2xl bg-gray-800 text-white p-4 mt-4 relative overflow-hidden min-h-[500px] w-full"
        >
          
          <CodeEditor code={userCode} onChange={setUserCode}/>

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

        <div className="mt-2 space-y-4">
          <Button
            onClick={answerQuestion}
            className="w-full"
            variant="contained"
          >
            回答
          </Button>
          <div className="p-4 rounded-md border border-[#3c3c3c] h-[100px]">
            <h3 className="text-xl font-semibold mb-2">結果</h3>
            <p className="text-xl font-bold">{result}</p>
            <p className="text-xl font-bold">{executionResult.logs}</p>
            <p className="text-xl font-bold">{executionResult.result}</p>
          </div>
        </div>
      </div>
      <div className="w-[50%] overflow-y-scroll">
        <div className="flex h-[30px] bg-gray-400 sticky top-0 z-10 font-bold text-xl">
          <p className="w-[50%]">問題</p>
          <p className="w-[50%]">答え</p>
        </div>
        <ReactDiffViewer
          oldValue={ast}
          newValue={answerAst}
          splitView={true}
          showDiffOnly={false}
        />
      </div>
      {/* {answerAst && <pre>{answerAst}</pre>} */}
    </div>
  );
};

export default GameScreen;
