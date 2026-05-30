require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Message = require('./models/messageModel');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const rozal = await User.findOne({ username: /rozal/i });
    const deep = await User.findOne({ username: /deep/i });
    
    const unread = await Message.countDocuments({
        senderId: deep._id,
        receiverId: rozal._id,
        status: { $ne: 'seen' }
    });
    console.log('Unread messages from Deep to Rozal:', unread);
    
    process.exit(0);
}
test();
