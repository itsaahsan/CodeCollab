import React from 'react';
import './ControlPanel.css';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
];

const THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast' }
];

function ControlPanel({
  language,
  onLanguageChange,
  onExecute,
  onToggleVideo,
  showVideo,
  onToggleChat,
  showChat,
  onToggleSnippets,
  theme,
  onThemeChange
}) {
  return (
    <div className="control-panel">
      <h3>⚙️ Controls</h3>

      <div className="control-group">
        <label>Language</label>
        <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Theme</label>
        <select value={theme} onChange={(e) => onThemeChange(e.target.value)}>
          {THEMES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-buttons">
        <button className="btn-execute" onClick={onExecute}>
          ▶ Run Code
        </button>

        <button className="btn-snippets" onClick={onToggleSnippets}>
          📚 Snippets
        </button>

        <button
          className={`btn-chat ${showChat ? 'active' : ''}`}
          onClick={onToggleChat}
        >
          💬 Chat
        </button>

        <button
          className={`btn-video ${showVideo ? 'active' : ''}`}
          onClick={onToggleVideo}
        >
          📹 Video
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
