const { io } = require('socket.io-client');
const axios = require('axios');

const BACKEND = 'https://chat-app-manish.onrender.com';
const api = axios.create({ baseURL: BACKEND + '/api', withCredentials: true });

async function test() {
    console.log('Testing...');
    try {
        // We can't easily login via script without a cookie jar. Let's just test the socket connection.
        const socket = io(BACKEND, { query: { userId: '123' }, transports: ['websocket'] });
        socket.on('connect', () => {
            console.log('Connected to socket', socket.id);
            socket.disconnect();
        });
        socket.on('connect_error', (err) => {
            console.log('Socket error:', err.message);
        });
    } catch(e) { console.error(e.message); }
}
test();
