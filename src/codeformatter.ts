import {
  js as beautifyJs,
  css as beautifyCss,
  html as beautifyHtml,
} from "js-beautify";

type CodeType = "javascript" | "typescript" | "css" | "html";

export const formatCode = (
  inputCode: string,
  type: CodeType = "javascript"
): string => {
  try {
    let formatted: string;

    const options = {
      indent_size: 2,
      space_in_empty_paren: true,
      // 必要に応じて他のオプションを追加できます
    };

    switch (type) {
      case "javascript":
        formatted = beautifyJs(inputCode, options);
        break;
      case "typescript":
        formatted = beautifyJs(inputCode, options);
        break;
      case "css":
        formatted = beautifyCss(inputCode, options);
        break;
      case "html":
        formatted = beautifyHtml(inputCode, options);
        break;
      default:
        throw new Error(`Unsupported code type: ${type}`);
    }

    console.log(formatted);

    return formatted;
  } catch (error) {
    console.error("Formatting error:", error);
    return inputCode; // フォーマットに失敗した場合、元のコードを返す
  }
};
