const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Progress = require('./models/Progress');

dotenv.config({ path: '../.env' });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find();
        for (const user of users) {
            console.log(`User: ${user.username}, Lang: ${user.selectedLanguage}, ID: ${user._id}`);
            const progresses = await Progress.find({ user: user._id });
            console.log('Progresses:', progresses);
        }
        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
