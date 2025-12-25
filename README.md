# CodeCollab - Real-time Collaborative Code Editor

A Google Docs-style collaborative code editor with real-time synchronization, multiple cursor tracking, syntax highlighting, code execution, video chat, and team messaging.

## Features

### Core Features
- **Real-time Collaboration**: Multiple users can edit code simultaneously with instant synchronization
- **Multi-file Support**: Create, rename, delete, and switch between multiple files in a single room
- **File Explorer**: Visual file tree with context menu actions
- **Multiple Cursors**: See where other users are typing in real-time with color-coded cursors
- **Syntax Highlighting**: Powered by Monaco Editor (VS Code's editor) with 50+ language support
- **Code Execution**: Run JavaScript code directly in the browser with console output
- **Video Chat**: Built-in WebRTC peer-to-peer video chat for pair programming
- **Text Chat**: Real-time messaging system with user join/leave notifications
- **Code Snippets Library**: Pre-built code snippets for common patterns
- **Theme Support**: Dark and light themes for the editor
- **Room-based**: Create or join rooms with unique room IDs

### Technical Highlights
- **WebSocket Communication**: Real-time bidirectional sync using Socket.io
- **Cursor Synchronization**: Live cursor positions and selections for all users
- **User Presence**: Live user list with colored indicators and status
- **Language Support**: JavaScript, Python, TypeScript, HTML, CSS, and many more
- **WebRTC Video**: Peer-to-peer video connections with automatic signaling
- **Responsive UI**: Clean, modern interface optimized for coding sessions

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks for component state management
- **Monaco Editor**: Full-featured VS Code editor component (@monaco-editor/react)
- **Socket.io Client**: WebSocket client for real-time communication
- **Simple-Peer**: WebRTC peer connections for video/audio streaming
- **React Scripts**: Create React App build tooling

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web server framework
- **Socket.io**: WebSocket server for real-time events
- **UUID**: Unique identifier generation for rooms and files
- **CORS**: Cross-Origin Resource Sharing middleware

## Project Structure

```
CodeCollab/
├── server/
│   └── index.js                    # Express + Socket.io WebSocket server
├── client/
│   ├── public/
│   │   ├── index.html              # HTML entry point
│   │   └── square.png              # App logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── CodeEditor.js       # Monaco editor wrapper with cursor sync
│   │   │   ├── UserList.js         # Active users with color indicators
│   │   │   ├── ControlPanel.js     # Language selector, run, video, chat controls
│   │   │   ├── FileExplorer.js     # Multi-file management interface
│   │   │   ├── Output.js           # Code execution results display
│   │   │   ├── VideoChat.js        # WebRTC video conferencing
│   │   │   ├── Chat.js             # Text messaging component
│   │   │   ├── SnippetsLibrary.js  # Code snippets collection
│   │   │   └── *.css               # Component-specific styles
│   │   ├── App.js                  # Main application logic & state
│   │   ├── App.css                 # Application styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   └── package.json                # Client dependencies
├── package.json                     # Server dependencies & scripts
└── README                           # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
cd ..
```

### Running the Application

#### Option 1: Run both servers concurrently
```bash
npm run dev
```

#### Option 2: Run servers separately

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## How to Use

### Getting Started
1. **Create or Join a Room**:
   - Enter a unique Room ID (e.g., "my-project-2024")
   - Enter your username
   - Click "Join Room" to enter the collaborative workspace

### Working with Files
2. **Managing Files**:
   - Create new files using the "+" button in the file explorer
   - Click on any file to switch to it
   - Right-click files to rename or delete them
   - All file operations sync automatically across all users

### Collaborative Coding
3. **Real-time Collaboration**:
   - Start typing code in the Monaco editor
   - See other users' cursors with their names and colors
   - Watch live edits as teammates type
   - Select programming language from the control panel dropdown
   - Click "Run Code" to execute JavaScript and see console output

### Communication
4. **Video Chat**:
   - Click the video icon to enable WebRTC video chat
   - Grant camera and microphone permissions when prompted
   - See all participants in a responsive video grid
   - Video streams are peer-to-peer for low latency

5. **Text Chat**:
   - Click the chat icon to open the messaging panel
   - Send messages to all room participants
   - See join/leave notifications for team members

### Code Snippets
6. **Using Snippets**:
   - Click the snippets icon to open the library
   - Browse pre-built code templates for common patterns
   - Click "Insert" to add a snippet to your current file
   - Snippets are organized by language

## Key Implementation Details

### Real-time Synchronization
- **WebSocket Events**: Socket.io handles bidirectional real-time communication
- **Code Changes**: Every keystroke is broadcast to all room members instantly
- **Cursor Tracking**: Live cursor positions and text selections synced across clients
- **File Operations**: Create, rename, delete, and switch operations propagated in real-time
- **State Management**: Server maintains authoritative room state for new joiners

### Multi-file System
- **File Structure**: Each room supports multiple files with unique IDs
- **Active File Tracking**: Server tracks which file each user is currently editing
- **File Metadata**: Name, language, and content stored per file
- **Persistent Sessions**: Room state maintained in-memory while users are connected

### Conflict Resolution
- **Last-write-wins**: Simple strategy for handling simultaneous edits
- **Character-level**: Changes applied at character level, not line level
- **Future Enhancement**: Could be upgraded to Operational Transformation (OT) or CRDTs

### Code Execution
- **JavaScript Only**: Currently supports JavaScript execution in Node.js
- **Sandboxed Environment**: Code runs in AsyncFunction with custom console
- **Output Capture**: Custom console.log implementation captures all output
- **Error Handling**: Full stack traces for debugging
- **Execution Time**: Tracks and displays code execution duration

### Video Chat
- **WebRTC Protocol**: Direct peer-to-peer connections for minimal latency
- **Simple-Peer**: Abstraction layer simplifying WebRTC setup
- **Signaling Server**: WebSocket server coordinates peer discovery and connection
- **Multi-party**: Supports multiple simultaneous video participants
- **Stream Management**: Automatic stream cleanup on user disconnect

### Chat System
- **Real-time Messages**: Instant message delivery via WebSocket
- **User Notifications**: Join/leave events automatically announced
- **Message History**: No persistence - messages exist only during session
- **User Context**: Messages include sender username and timestamp

## Security Considerations

**Important**: This is a demonstration project. For production deployment, implement:

### Authentication & Authorization
- User authentication system (OAuth, JWT, etc.)
- Room access controls and permissions
- User role management (owner, editor, viewer)
- Password-protected or invite-only rooms

### Code Execution Security
- **Critical**: Current JavaScript execution is NOT sandboxed
- Use containerized execution environments (Docker, VM2, isolated-vm)
- Implement execution timeouts and resource limits
- Block access to sensitive Node.js APIs (fs, process, etc.)
- Consider using a dedicated code execution service

### Network Security
- HTTPS for production (required for WebRTC)
- Secure WebSocket connections (WSS)
- CORS configuration with specific origins
- Rate limiting on WebSocket events
- DDoS protection

### Input Validation
- Sanitize all user inputs (usernames, room IDs, code, messages)
- Validate file names and prevent path traversal
- Limit file sizes and number of files per room
- XSS protection for chat messages

### Data Management
- Database for persistent storage (currently in-memory only)
- Regular backups of user data
- GDPR compliance for user data
- Session management and cleanup

## Future Enhancements

### Planned Features
- **Git Integration**: Version control, branches, commits, and diffs
- **Screen Sharing**: Share your entire screen or specific applications
- **Multi-language Execution**: Support for Python, Java, C++, Go, etc.
- **Operational Transformation**: Advanced conflict resolution (Google Docs-style)
- **Database Persistence**: Save rooms, files, and history permanently
- **User Authentication**: Login system with Google, GitHub OAuth
- **Code Formatting**: Auto-format code with Prettier, Black, etc.
- **Linting**: Real-time code quality feedback (ESLint, PyLint)
- **Collaborative Debugging**: Shared breakpoints and debugging sessions
- **Terminal Sharing**: Share terminal sessions for command execution
- **AI Code Assistant**: Integrate AI for code suggestions and explanations
- **File Uploads**: Upload existing project files and folders
- **Export/Download**: Download entire projects as ZIP files
- **Syntax Error Detection**: Real-time error highlighting
- **Code Review Tools**: Inline comments and suggestions
- **Room Templates**: Pre-configured project templates
- **Mobile Support**: Responsive design for tablets and phones
- **Audio-only Mode**: Voice chat without video
- **Recording**: Record coding sessions for later review

## Browser Support

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full Support | Recommended |
| Edge | ✅ Full Support | Chromium-based |
| Firefox | ✅ Full Support | May need camera permissions |
| Safari | ⚠️ Limited | WebRTC may have limitations |
| Opera | ✅ Full Support | Chromium-based |
| Brave | ✅ Full Support | May need to allow WebRTC |

**Requirements**:
- Modern browser with ES6+ support
- WebSocket support
- WebRTC support for video chat
- LocalStorage enabled

## Troubleshooting

### Port Already in Use
```bash
# Option 1: Change server port
# Edit server/index.js, line 232:
const PORT = process.env.PORT || 3002;  # Change 3001 to 3002

# Option 2: Kill the process using the port
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3001
kill -9 <PID>
```

### Video Chat Not Working
- **Permissions**: Check browser permissions for camera/microphone
- **HTTPS Required**: WebRTC requires HTTPS in production (localhost works with HTTP)
- **Firewall**: Ensure WebRTC ports aren't blocked
- **Browser Compatibility**: Try Chrome/Edge for best results
- **Check Console**: Look for getUserMedia errors in browser console

### Monaco Editor Not Loading
- **Internet Connection**: Monaco loads assets from CDN
- **CDN Issues**: Check browser console for 404 or network errors
- **Adblocker**: Disable adblockers that might block CDN requests
- **Check Network Tab**: Verify Monaco assets are loading

### Connection Issues
- **Backend Not Running**: Ensure server is running on port 3001
- **CORS Errors**: Server is configured for localhost:3000 only
- **WebSocket Errors**: Check if proxy in client/package.json matches server port
- **Firewall**: Check if ports 3000 and 3001 are accessible

### Code Execution Fails
- **Language**: Only JavaScript is currently supported
- **Syntax Errors**: Check console for error messages
- **Infinite Loops**: Code execution may hang (no timeout implemented)
- **Async Code**: Use console.log within async/await functions

### Performance Issues
- **Too Many Users**: In-memory storage may struggle with 10+ users
- **Large Files**: Very large code files may cause lag
- **Network Latency**: High latency affects real-time synchronization
- **Clear Browser Cache**: Sometimes helps with Monaco editor issues

## API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```

Returns server status and statistics:
```json
{
  "status": "ok",
  "rooms": 3,
  "users": 7
}
```

## WebSocket Events

### Client → Server
- `join-room`: Join a collaboration room
- `code-change`: Send code updates
- `cursor-position`: Update cursor position
- `language-change`: Change file language
- `file-create`: Create a new file
- `file-delete`: Delete a file
- `file-rename`: Rename a file
- `file-select`: Switch active file
- `execute-code`: Run code execution
- `chat-message`: Send chat message
- `webrtc-signal`: WebRTC signaling

### Server → Client
- `room-state`: Initial room state on join
- `user-joined`: New user notification
- `user-left`: User disconnect notification
- `code-update`: Code changes from other users
- `cursor-update`: Cursor position updates
- `language-update`: Language changes
- `file-created`: New file notification
- `file-deleted`: File deletion notification
- `file-renamed`: File rename notification
- `file-selected`: File selection by other users
- `execution-result`: Code execution output
- `chat-message`: Incoming chat messages
- `webrtc-signal`: WebRTC connection signals

## Performance Considerations

### Current Limitations
- **In-memory Storage**: All data lost on server restart
- **No Scaling**: Single server instance only
- **Memory Usage**: Grows with number of rooms and files
- **No Compression**: WebSocket messages not compressed

### Optimization Recommendations
- Implement Redis for distributed room management
- Add WebSocket message compression
- Use operational transformation for better conflict resolution
- Implement pagination for large files
- Add debouncing for cursor position updates
- Use connection pooling for database (when added)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test all features before submitting PR
- Update README for new features
- Ensure no console errors

## License

MIT License - feel free to use this project for learning, portfolios, or as a base for your own applications.

## Contact & Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Pull Requests**: Contributions welcome

## Acknowledgments

- **Monaco Editor**: Microsoft's VS Code editor
- **Socket.io**: Real-time WebSocket library
- **Simple-Peer**: WebRTC abstraction
- **React**: UI framework
- **Express**: Web server framework

## Use Cases

This project is ideal for:
- **Pair Programming**: Remote coding sessions with teammates
- **Code Interviews**: Technical interviews with live coding
- **Teaching**: Instructor demonstrating code to students
- **Code Reviews**: Collaborative code review sessions
- **Hackathons**: Quick collaborative prototyping
- **Learning**: Understanding real-time web applications
- **Portfolio Projects**: Showcase full-stack skills

---

Built as a demonstration of real-time collaborative features using modern web technologies.

## Author

**Ahsan Ali**
GitHub: [@itsaahsan](https://github.com/itsaahsan)
