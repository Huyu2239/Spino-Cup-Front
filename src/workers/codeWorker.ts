/* eslint-disable */

// src/workers/codeWorker.ts
/// <reference lib="webworker" />

import "ses";

// SES をロックダウン
lockdown({
  errorTaming: "unsafe",
  stackFiltering: "verbose",
});

// エンドウメントの設定
const endowments = {
  console: {
    log: (message: any) => {
      // メインスレッドにログを送信
      self.postMessage({ type: "log", message });
    },
  },
};

// Compartment の作成
const compartment = new Compartment(endowments);

// メインスレッドからメッセージを受信
self.onmessage = async (event) => {
  const { code, id } = event.data;

  try {
    // ユーザーコードを直接評価
    const result = compartment.evaluate(code);

    // 結果が Promise の場合は待機
    const awaitedResult = result instanceof Promise ? await result : result;

    self.postMessage({ type: "result", result: awaitedResult, id });
  } catch (error: any) {
    self.postMessage({ type: "error", error: error.message, id });
  }
};
