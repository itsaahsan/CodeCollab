import React, { useState } from 'react';
import './FileExplorer.css';

function FileExplorer({ files, activeFile, onFileSelect, onFileCreate, onFileDelete, onFileRename }) {
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim());
      setNewFileName('');
      setShowNewFileInput(false);
    }
  };

  const handleRename = (fileId) => {
    if (renameValue.trim()) {
      onFileRename(fileId, renameValue.trim());
      setRenamingFile(null);
      setRenameValue('');
    }
  };

  const startRename = (file) => {
    setRenamingFile(file.id);
    setRenameValue(file.name);
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
      'js': '📜',
      'jsx': '⚛️',
      'ts': '📘',
      'tsx': '⚛️',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚙️',
      'c': '⚙️',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'md': '📝'
    };
    return iconMap[ext] || '📄';
  };

  return (
    <div className="file-explorer">
      <div className="file-explorer-header">
        <h3>Files</h3>
        <button
          className="btn-new-file"
          onClick={() => setShowNewFileInput(true)}
          title="New File"
        >
          +
        </button>
      </div>

      {showNewFileInput && (
        <div className="new-file-input">
          <input
            type="text"
            placeholder="filename.js"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleCreateFile();
              if (e.key === 'Escape') setShowNewFileInput(false);
            }}
            autoFocus
          />
          <button onClick={handleCreateFile}>✓</button>
          <button onClick={() => setShowNewFileInput(false)}>✕</button>
        </div>
      )}

      <div className="file-list">
        {files.map((file) => (
          <div
            key={file.id}
            className={`file-item ${activeFile === file.id ? 'active' : ''}`}
          >
            {renamingFile === file.id ? (
              <div className="rename-input">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleRename(file.id);
                    if (e.key === 'Escape') setRenamingFile(null);
                  }}
                  onBlur={() => handleRename(file.id)}
                  autoFocus
                />
              </div>
            ) : (
              <>
                <div
                  className="file-name-container"
                  onClick={() => onFileSelect(file.id)}
                >
                  <span className="file-icon">{getFileIcon(file.name)}</span>
                  <span className="file-name">{file.name}</span>
                </div>
                <div className="file-actions">
                  <button
                    className="btn-rename"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(file);
                    }}
                    title="Rename"
                  >
                    ✎
                  </button>
                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete ${file.name}?`)) {
                        onFileDelete(file.id);
                      }
                    }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {files.length === 0 && !showNewFileInput && (
        <div className="empty-state">
          <p>No files yet</p>
          <button onClick={() => setShowNewFileInput(true)}>Create first file</button>
        </div>
      )}
    </div>
  );
}

export default FileExplorer;
