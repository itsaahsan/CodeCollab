const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();
const users = new Map();

function getRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      files: [{
        id: 'default',
        name: 'main.js',
        code: '// Start coding together!\n',
        language: 'javascript'
      }],
      activeFile: 'default',
      users: new Map(),
      cursors: new Map()
    });
  }
  return rooms.get(roomId);
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', ({ roomId, username, color }) => {
    socket.join(roomId);

    const room = getRoom(roomId);
    const user = {
      id: socket.id,
      username: username || `User-${socket.id.substring(0, 4)}`,
      color: color || `#${Math.floor(Math.random()*16777215).toString(16)}`
    };

    room.users.set(socket.id, user);
    users.set(socket.id, { roomId, ...user });

    socket.emit('room-state', {
      files: room.files,
      activeFile: room.activeFile,
      users: Array.from(room.users.values()),
      cursors: Array.from(room.cursors.entries()).map(([id, cursor]) => ({
        userId: id,
        ...cursor
      }))
    });

    socket.to(roomId).emit('user-joined', user);
    socket.to(roomId).emit('user-joined-chat', { username: user.username });

    console.log(`${user.username} joined room ${roomId}`);
  });

  socket.on('code-change', ({ roomId, fileId, code }) => {
    const room = getRoom(roomId);
    const fileIndex = room.files.findIndex(f => f.id === fileId);

    if (fileIndex !== -1) {
      room.files[fileIndex].code = code;
    }

    socket.to(roomId).emit('code-update', {
      fileId,
      code,
      userId: socket.id
    });
  });

  socket.on('file-create', ({ roomId, file }) => {
    const room = getRoom(roomId);
    room.files.push(file);
    socket.to(roomId).emit('file-created', file);
  });

  socket.on('file-delete', ({ roomId, fileId }) => {
    const room = getRoom(roomId);
    room.files = room.files.filter(f => f.id !== fileId);
    socket.to(roomId).emit('file-deleted', fileId);
  });

  socket.on('file-rename', ({ roomId, fileId, newName }) => {
    const room = getRoom(roomId);
    const file = room.files.find(f => f.id === fileId);
    if (file) {
      file.name = newName;
    }
    socket.to(roomId).emit('file-renamed', { fileId, newName });
  });

  socket.on('file-select', ({ roomId, fileId }) => {
    const room = getRoom(roomId);
    room.activeFile = fileId;
    socket.to(roomId).emit('file-selected', { fileId });
  });

  socket.on('cursor-position', ({ roomId, fileId, position, selection }) => {
    const room = getRoom(roomId);
    const user = room.users.get(socket.id);

    if (user) {
      room.cursors.set(socket.id, { fileId, position, selection, user });

      socket.to(roomId).emit('cursor-update', {
        userId: socket.id,
        fileId,
        position,
        selection,
        user
      });
    }
  });

  socket.on('language-change', ({ roomId, fileId, language }) => {
    const room = getRoom(roomId);
    const file = room.files.find(f => f.id === fileId);
    if (file) {
      file.language = language;
    }
    socket.to(roomId).emit('language-update', { fileId, language });
  });

  socket.on('execute-code', async ({ roomId, code, language }) => {
    const result = await executeCode(code, language);
    io.to(roomId).emit('execution-result', result);
  });

  socket.on('chat-message', ({ roomId, message }) => {
    socket.to(roomId).emit('chat-message', message);
  });

  socket.on('webrtc-signal', ({ roomId, to, signal }) => {
    socket.to(to).emit('webrtc-signal', {
      from: socket.id,
      signal
    });
  });

  socket.on('disconnect', () => {
    const userData = users.get(socket.id);

    if (userData) {
      const room = rooms.get(userData.roomId);

      if (room) {
        room.users.delete(socket.id);
        room.cursors.delete(socket.id);

        socket.to(userData.roomId).emit('user-left', {
          userId: socket.id,
          username: userData.username
        });

        socket.to(userData.roomId).emit('user-left-chat', {
          username: userData.username
        });

        if (room.users.size === 0) {
          rooms.delete(userData.roomId);
        }
      }

      users.delete(socket.id);
    }

    console.log('Client disconnected:', socket.id);
  });
});

async function executeCode(code, language) {
  try {
    let output = '';
    const startTime = Date.now();

    if (language === 'javascript') {
      const logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
      };

      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const func = new AsyncFunction('console', code);

      await func(customConsole);
      output = logs.join('\n');
    } else {
      output = `Code execution for ${language} is not implemented yet.\nThis would require a sandboxed execution environment.`;
    }

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      output: output || '(no output)',
      executionTime
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    users: users.size
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
