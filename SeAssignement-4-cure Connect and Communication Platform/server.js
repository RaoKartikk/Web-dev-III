require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Real-Time Chat (Socket.IO)
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', (room = 'general') => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  socket.on('chatMessage', ({ room = 'general', username, message }) => {
    console.log(`[${room}] ${username}: ${message}`);
    io.to(room).emit('message', {
      sender: username,
      message,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});