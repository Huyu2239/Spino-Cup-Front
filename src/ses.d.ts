/* eslint-disable */

// src/ses.d.ts

declare module "ses" {
  // 空の宣言で、`import 'ses';` を許可します
}

declare global {
  function lockdown(options?: any): void;

  class Compartment {
    constructor(endowments?: Record<string, any>, modules?: any, options?: any);
    evaluate(code: string): any;
  }
}
