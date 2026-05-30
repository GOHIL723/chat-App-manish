const { io } = require('socket.io-client');
const axios = require('axios');

const BACKEND = 'https://chat-app-manish.onrender.com';
// const BACKEND = 'http://localhost:5000'; // if testing locally

async function test() {
    try {
        const api = axios.create({ baseURL: BACKEND + '/api', withCredentials: true });
        
        // Login Deep
        let deepRes = await api.post('/auth/login', { username: 'deep', password: 'password' }).catch(() => null);
        if(!deepRes) deepRes = await api.post('/auth/login', { username: 'deep', password: 'test123456' });
        const deepToken = deepRes.headers['set-cookie'];
        const deepId = deepRes.data._id;
        console.log('Deep logged in', deepId);
        
        // Login Rozal
        let rozalRes = await api.post('/auth/login', { username: 'rozal', password: 'password' }).catch(() => null);
        if(!rozalRes) rozalRes = await api.post('/auth/login', { username: 'rozal', password: 'test123456' });
        const rozalToken = rozalRes.headers['set-cookie'];
        const rozalId = rozalRes.data._id;
        console.log('Rozal logged in', rozalId);
        
        // Connect Rozal socket
        const rozalSocket = io(BACKEND, { 
            query: { userId: rozalId }, 
            transports: ['websocket'],
            extraHeaders: { Cookie: rozalToken.join(';') }
        });
        
        rozalSocket.on('connect', () => {
            console.log('Rozal socket connected', rozalSocket.id);
            
            rozalSocket.on('newMessage', (msg) => {
                console.log('>>> ROZAL RECEIVED MESSAGE:', msg.message);
                process.exit(0);
            });
            
            // Deep sends message to Rozal
            console.log('Deep sending message...');
            axios.post(BACKEND + '/api/messages/send/' + rozalId, 
                { message: 'Test message from script ' + Date.now() },
                { headers: { Cookie: deepToken.join(';') } }
            ).then(res => {
                console.log('Deep sent message OK');
            }).catch(e => console.log('Deep send failed', e.message));
        });
        
        setTimeout(() => {
            console.log('Timeout waiting for message');
            process.exit(1);
        }, 10000);
        
    } catch(e) { console.error(e.response ? e.response.data : e.message); }
}
test();
