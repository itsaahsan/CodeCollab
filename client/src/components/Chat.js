import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

function Chat({ socket, roomId, username, users, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('user-joined-chat', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          content: `${data.username} joined the room`,
          timestamp: Date.now()
        }
      ]);
    });

    socket.on('user-left-chat', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'system',
          content: `${data.username} left the room`,
          timestamp: Date.now()
        }
      ]);
    });

    return () => {
      socket.off('chat-message');
      socket.off('user-joined-chat');
      socket.off('user-left-chat');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim()) {
      const message = {
        type: 'user',
        username,
        content: inputValue.trim(),
        timestamp: Date.now(),
        userId: socket.id
      };

      socket.emit('chat-message', { roomId, message });
      setMessages((prev) => [...prev, message]);
      setInputValue('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Chat</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p>No messages yet</p>
            <p className="chat-hint">Start the conversation!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message message-${msg.type}`}>
            {msg.type === 'system' ? (
              <div className="system-message">{msg.content}</div>
            ) : (
              <div className="user-message">
                <div className="message-header">
                  <span
                    className="message-username"
                    style={{
                      color: users.find((u) => u.id === msg.userId)?.color || '#4ec9b0'
                    }}
                  >
                    {msg.username}
                  </span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage} disabled={!inputValue.trim()}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default Chat;
