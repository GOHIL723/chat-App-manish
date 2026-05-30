require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Message = require('./models/messageModel');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    
    const rozal = await User.findOne({ username: /rozal/i });
    if(rozal) {
        console.log('Rozal found:', rozal.username, rozal._id.toString());
        const deep = await User.findOne({ username: /deep/i });
        if(deep) {
            console.log('Deep found:', deep.username, deep._id.toString());
            
            const msgs = await Message.find({
                $or: [
                    { senderId: deep._id, receiverId: rozal._id },
                    { senderId: rozal._id, receiverId: deep._id }
                ]
            });
            console.log('Messages between them:', msgs.length);
        } else console.log('Deep not found');
    } else console.log('Rozal not found');
    
    process.exit(0);
}
test();
