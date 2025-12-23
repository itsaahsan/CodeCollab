import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ code, language, cursors, onChange, onCursorChange, theme }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();

    if (!model) return;

    const newDecorations = cursors.map((cursor) => {
      const { position, selection, user } = cursor;

      if (!position) return null;

      const decorations = [];

      if (selection && selection.startLineNumber && selection.endLineNumber) {
        decorations.push({
          range: new window.monaco.Range(
            selection.startLineNumber,
            selection.startColumn,
            selection.endLineNumber,
            selection.endColumn
          ),
          options: {
            className: 'remote-selection',
            inlineClassName: 'remote-selection-inline',
            stickiness: 1,
            minimap: {
              color: user.color,
              position: 1
            }
          }
        });
      }

      decorations.push({
        range: new window.monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        options: {
          className: 'remote-cursor',
          hoverMessage: { value: `**${user.username}**` },
          stickiness: 1,
          beforeContentClassName: 'remote-cursor-line',
          afterContentClassName: 'remote-cursor-label',
          after: {
            content: user.username,
            inlineClassName: 'remote-cursor-name',
            inlineClassNameAffectsLetterSpacing: true
          },
          minimap: {
            color: user.color,
            position: 2
          }
        }
      });

      const style = document.createElement('style');
      style.textContent = `
        .remote-cursor-${cursor.userId}::before {
          border-left: 2px solid ${user.color};
          background-color: ${user.color};
        }
        .remote-selection-${cursor.userId} {
          background-color: ${user.color}33;
        }
      `;
      document.head.appendChild(style);

      return decorations;
    }).flat().filter(Boolean);

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [cursors]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      const selection = editor.getSelection();

      onCursorChange(position, {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      });
    });
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={onChange}
      onMount={handleEditorDidMount}
      theme={theme || "vs-dark"}
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        cursorStyle: 'line',
        cursorBlinking: 'smooth',
        renderLineHighlight: 'all',
        lineNumbers: 'on',
        folding: true,
        links: true,
        mouseWheelZoom: true
      }}
    />
  );
}

export default CodeEditor;
