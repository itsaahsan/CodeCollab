import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import CodeEditor from './components/CodeEditor';
import UserList from './components/UserList';
import VideoChat from './components/VideoChat';
import ControlPanel from './components/ControlPanel';
import Output from './components/Output';
import FileExplorer from './components/FileExplorer';
import Chat from './components/Chat';
import SnippetsLibrary from './components/SnippetsLibrary';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [files, setFiles] = useState([{ id: 'default', name: 'main.js', code: '// Start coding together!\n', language: 'javascript' }]);
  const [activeFile, setActiveFile] = useState('default');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState([]);
  const [cursors, setCursors] = useState([]);
  const [output, setOutput] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [theme, setTheme] = useState('vs-dark');

  const currentFile = files.find(f => f.id === activeFile);

  useEffect(() => {
    socket.on('room-state', ({ files, activeFile, users, cursors }) => {
      if (files) setFiles(files);
      if (activeFile) setActiveFile(activeFile);
      setUsers(users);
      setCursors(cursors);
    });

    socket.on('user-joined', (user) => {
      setUsers((prev) => [...prev, user]);
    });

    socket.on('user-left', ({ userId, username }) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setCursors((prev) => prev.filter((c) => c.userId !== userId));
    });

    socket.on('code-update', ({ fileId, code }) => {
      setFiles((prev) => prev.map(f => f.id === fileId ? { ...f, code } : f));
    });

    socket.on('file-created', (file) => {
      setFiles((prev) => [...prev, file]);
    });

    socket.on('file-deleted', (fileId) => {
      setFiles((prev) => prev.filter(f => f.id !== fileId));
      if (activeFile === fileId && files.length > 1) {
        setActiveFile(files[0].id);
      }
    });

    socket.on('file-renamed', ({ fileId, newName }) => {
      setFiles((prev) => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
    });

    socket.on('file-selected', ({ fileId }) => {
      setActiveFile(fileId);
    });

    socket.on('cursor-update', ({ userId, position, selection, user }) => {
      setCursors((prev) => {
        const filtered = prev.filter((c) => c.userId !== userId);
        return [...filtered, { userId, position, selection, user }];
      });
    });

    socket.on('language-update', ({ fileId, language }) => {
      setFiles((prev) => prev.map(f => f.id === fileId ? { ...f, language } : f));
      if (fileId === activeFile) {
        setLanguage(language);
      }
    });

    socket.on('execution-result', (result) => {
      setOutput(result);
    });

    return () => {
      socket.off('room-state');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('code-update');
      socket.off('file-created');
      socket.off('file-deleted');
      socket.off('file-renamed');
      socket.off('file-selected');
      socket.off('cursor-update');
      socket.off('language-update');
      socket.off('execution-result');
    };
  }, [activeFile, files]);

  const joinRoom = () => {
    if (roomId.trim() && username.trim()) {
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      socket.emit('join-room', { roomId, username, color });
      setJoined(true);
    }
  };

  const handleCodeChange = (newCode) => {
    setFiles((prev) => prev.map(f => f.id === activeFile ? { ...f, code: newCode } : f));
    socket.emit('code-change', { roomId, fileId: activeFile, code: newCode });
  };

  const handleCursorChange = (position, selection) => {
    socket.emit('cursor-position', { roomId, fileId: activeFile, position, selection });
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setFiles((prev) => prev.map(f => f.id === activeFile ? { ...f, language: newLanguage } : f));
    socket.emit('language-change', { roomId, fileId: activeFile, language: newLanguage });
  };

  const handleFileCreate = (filename) => {
    const newFile = {
      id: Date.now().toString(),
      name: filename,
      code: '',
      language: 'javascript'
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFile(newFile.id);
    socket.emit('file-create', { roomId, file: newFile });
  };

  const handleFileDelete = (fileId) => {
    if (files.length === 1) {
      alert('Cannot delete the last file');
      return;
    }
    setFiles((prev) => prev.filter(f => f.id !== fileId));
    if (activeFile === fileId) {
      setActiveFile(files[0].id);
    }
    socket.emit('file-delete', { roomId, fileId });
  };

  const handleFileRename = (fileId, newName) => {
    setFiles((prev) => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
    socket.emit('file-rename', { roomId, fileId, newName });
  };

  const handleFileSelect = (fileId) => {
    setActiveFile(fileId);
    const file = files.find(f => f.id === fileId);
    if (file) {
      setLanguage(file.language);
    }
    socket.emit('file-select', { roomId, fileId });
  };

  const executeCode = () => {
    socket.emit('execute-code', { roomId, code: currentFile?.code || '', language });
  };

  const handleInsertSnippet = (code) => {
    const currentCode = currentFile?.code || '';
    const newCode = currentCode + '\n\n' + code;
    handleCodeChange(newCode);
  };

  if (!joined) {
    return (
      <div className="login-container">
        <div className="login-box">
          <img src="/square.png" alt="CodeCollab" className="login-logo-img" />
          <h1>CodeCollab</h1>
          <p>Real-time collaborative code editor with superpowers</p>
          <div className="login-features">
            <span>📝 Multi-file</span>
            <span>💬 Chat</span>
            <span>📹 Video</span>
            <span>📚 Snippets</span>
          </div>
          <input
            type="text"
            placeholder="Room ID (e.g., my-project)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          />
          <input
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
          />
          <button onClick={joinRoom} disabled={!roomId.trim() || !username.trim()}>
            Join Room →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <img src="/square.png" alt="CodeCollab" className="logo-img" />
          <h1>CodeCollab</h1>
        </div>
        <div className="room-info">
          <span className="info-badge room-badge">
            <span className="badge-label">Room:</span>
            <strong>{roomId}</strong>
          </span>
          <span className="info-badge user-badge">
            <span className="badge-label">User:</span>
            <strong>{username}</strong>
          </span>
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <FileExplorer
            files={files}
            activeFile={activeFile}
            onFileSelect={handleFileSelect}
            onFileCreate={handleFileCreate}
            onFileDelete={handleFileDelete}
            onFileRename={handleFileRename}
          />
          <UserList users={users} />
          <ControlPanel
            language={language}
            onLanguageChange={handleLanguageChange}
            onExecute={executeCode}
            onToggleVideo={() => setShowVideo(!showVideo)}
            showVideo={showVideo}
            onToggleChat={() => setShowChat(!showChat)}
            showChat={showChat}
            onToggleSnippets={() => setShowSnippets(true)}
            theme={theme}
            onThemeChange={setTheme}
          />
        </div>

        <div className="editor-container">
          <div className="editor-header">
            <span className="file-indicator">
              {currentFile?.name || 'No file selected'}
            </span>
          </div>
          <CodeEditor
            code={currentFile?.code || ''}
            language={language}
            cursors={cursors}
            onChange={handleCodeChange}
            onCursorChange={handleCursorChange}
            theme={theme}
          />
          {output && <Output result={output} onClose={() => setOutput(null)} />}
        </div>

        {showVideo && (
          <VideoChat
            socket={socket}
            roomId={roomId}
            users={users}
            onClose={() => setShowVideo(false)}
          />
        )}

        <Chat
          socket={socket}
          roomId={roomId}
          username={username}
          users={users}
          isOpen={showChat}
          onClose={() => setShowChat(false)}
        />

        <SnippetsLibrary
          isOpen={showSnippets}
          onClose={() => setShowSnippets(false)}
          onInsert={handleInsertSnippet}
          language={language}
        />
      </div>
    </div>
  );
}

export default App;
