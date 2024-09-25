/* eslint-disable */
import { useEffect, useRef, useState, useCallback } from "react";

type WorkerMessage =
  | { type: "log"; message: string }
  | { type: "result"; result: any; id: number }
  | { type: "error"; error: string; id: number };

interface ExecutionResult {
  logs: string[];
  result: any;
  error: string | null;
}

const useCodeExecutor = () => {
  const [executionResult, setExecutionResult] = useState<ExecutionResult>({
    logs: [],
    result: null,
    error: null,
  });

  const workerRef = useRef<Worker | null>(null);
  const messageIdRef = useRef<number>(0);
  const pendingPromisesRef = useRef<
    Map<
      number,
      { resolve: (value: any) => void; reject: (reason?: any) => void }
    >
  >(new Map());

  // Worker の初期化関数
  const initializeWorker = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    workerRef.current = new Worker(
      new URL("../workers/codeWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    workerRef.current.onmessage = (event: MessageEvent) => {
      const data: WorkerMessage = event.data;

      if (data.type === "log") {
        setExecutionResult((prev) => ({
          ...prev,
          logs: [...prev.logs, `ログ: ${data.message}`],
        }));
      } else if (data.type === "result" || data.type === "error") {
        const { id } = data;
        const promise = pendingPromisesRef.current.get(id);
        if (promise) {
          if (data.type === "result") {
            promise.resolve(data.result);
          } else {
            promise.reject(new Error(data.error));
          }
          pendingPromisesRef.current.delete(id);
        }
      }
    };

    workerRef.current.onerror = (event) => {
      setExecutionResult((prev) => ({
        ...prev,
        error: `Worker Error: ${event.message}`,
      }));
    };
  }, []);

  useEffect(() => {
    // 初期化時に Worker をセットアップ
    initializeWorker();

    return () => {
      // クリーンアップ時に Worker を終了
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [initializeWorker]);

  const executeCode = useCallback(
    (code: string, timeout: number = 5000): Promise<any> => {
      if (!workerRef.current) {
        return Promise.reject(new Error("Worker is not initialized"));
      }

      const currentId = messageIdRef.current++;
      setExecutionResult({
        logs: [],
        result: null,
        error: null,
      });

      const codePromise = new Promise<any>((resolve, reject) => {
        pendingPromisesRef.current.set(currentId, { resolve, reject });
      });

      // コードを Worker に送信
      workerRef.current.postMessage({ code, id: currentId });

      // タイムアウト設定
      const timeoutId = setTimeout(() => {
        // タイムアウトが発生したら Worker を再初期化
        if (workerRef.current) {
          workerRef.current.terminate();
          initializeWorker();
        }
        setExecutionResult((prev) => ({
          ...prev,
          error: "実行がタイムアウトしました。",
        }));
        pendingPromisesRef.current.delete(currentId);
        // Promise を拒否
        const promise = pendingPromisesRef.current.get(currentId);
        if (promise) {
          promise.reject(new Error("実行がタイムアウトしました。"));
          pendingPromisesRef.current.delete(currentId);
        }
      }, timeout);

      codePromise
        .then((result) => {
          clearTimeout(timeoutId);
          setExecutionResult((prev) => ({
            ...prev,
            result,
          }));
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          setExecutionResult((prev) => ({
            ...prev,
            error: error.message,
          }));
        });

      return codePromise;
    },
    [initializeWorker]
  );

  const clearOutput = useCallback(() => {
    setExecutionResult({
      logs: [],
      result: null,
      error: null,
    });
  }, []);

  return { executeCode, executionResult, clearOutput };
};

export default useCodeExecutor;
