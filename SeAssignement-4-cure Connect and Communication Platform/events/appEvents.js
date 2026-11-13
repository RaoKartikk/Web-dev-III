const EventEmitter = require('events');

class AppEmitter extends EventEmitter {}
const appEvents = new AppEmitter();

appEvents.on('user:registered', (user) => {
  console.log(`[event] New user registered: ${user.username} (${user.email})`);
});

appEvents.on('user:loggedIn', (user) => {
  console.log(`[event] User logged in: ${user.username}`);
});

appEvents.on('note:created', ({ noteId, owner }) => {
  console.log(`[event] Note created (${noteId}) by user ${owner}`);
});

module.exports = appEvents;