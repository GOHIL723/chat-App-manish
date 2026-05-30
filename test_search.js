const axios = require('axios');
async function test() {
    try {
        const res = await axios.get('https://chat-app-manish.onrender.com/api/messages/search-all?q=rozal');
        console.log(res.data);
    } catch(e) { console.log(e.response ? e.response.status : e.message); }
}
test();
