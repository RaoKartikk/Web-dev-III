const { io } = require('socket.io-client');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- 1. TESTING SIGNUP ---');
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'victor',
      email: 'victor@example.com',
      password: '123456'
    })
  });
  console.log('Status:', signupRes.status);
  console.log(await signupRes.json());

  console.log('\n--- 2. TESTING LOGIN ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'victor@example.com',
      password: '123456'
    })
  });
  const loginData = await loginRes.json();
  console.log('Status:', loginRes.status);
  console.log(loginData);
  const token = loginData.token;

  console.log('\n--- 3. TESTING NOTES WITHOUT TOKEN ---');
  const noTokenRes = await fetch(`${BASE_URL}/api/notes`);
  console.log('Status:', noTokenRes.status);
  console.log(await noTokenRes.json());

  console.log('\n--- 4. CREATING NOTE WITH TOKEN ---');
  const createNoteRes = await fetch(`${BASE_URL}/api/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: 'My First Note',
      content: 'This is my first note of web dev -III'
    })
  });
  console.log('Status:', createNoteRes.status);
  console.log(await createNoteRes.json());

  console.log('\n--- 5. FETCHING ALL NOTES ---');
  const getNotesRes = await fetch(`${BASE_URL}/api/notes`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log('Status:', getNotesRes.status);
  console.log(await getNotesRes.json());

  console.log('\n--- 6. TESTING SOCKET.IO REAL-TIME CHAT ---');
  const aditi = io(BASE_URL);
  const rohan = io(BASE_URL);

  aditi.on('connect', () => {
    aditi.emit('joinRoom', 'general');
    setTimeout(() => {
      aditi.emit('chatMessage', {
        room: 'general',
        username: 'Aditi',
        message: 'Hey team, backend is ready'
      });
    }, 300);
  });

  rohan.on('connect', () => {
    rohan.emit('joinRoom', 'general');
    setTimeout(() => {
      rohan.emit('chatMessage', {
        room: 'general',
        username: 'Rohan',
        message: 'Testing chat now...'
      });
    }, 600);
  });

  setTimeout(() => {
    aditi.emit('chatMessage', {
      room: 'general',
      username: 'Aditi',
      message: 'Messages arriving in real time'
    });
  }, 900);

  setTimeout(() => {
    aditi.disconnect();
    rohan.disconnect();
    process.exit(0);
  }, 1500);
}

runTests();