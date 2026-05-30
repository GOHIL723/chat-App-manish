const mongoose = require('mongoose');
const User = require('./server/models/userModel');
const Message = require('./server/models/messageModel');

async function test() {
    await mongoose.connect('mongodb+srv://GOHIL723:GOHIL723@cluster0.spbnhgw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log("Connected to DB");
    
    // Check Rozal
    const rozal = await User.findOne({ username: /rozal/i });
    if(rozal) {
        console.log('Rozal found:', rozal.username, rozal._id.toString());
        // Check deep
        const deep = await User.findOne({ username: /deep/i });
        if(deep) {
            console.log('Deep found:', deep.username, deep._id.toString());
            
            // Check if messages exist between them
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
