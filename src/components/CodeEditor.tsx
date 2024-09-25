import { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor"; // monaco-editorの型をインポート

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
  return (
    <Editor
      height="600px"
      defaultLanguage="javascript"
      defaultValue="// your code here"
      value={code}
      onChange={(value) => onChange(value || "")}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 18,
        automaticLayout: true,
      }}
    />
  );
};

export default CodeEditor;
