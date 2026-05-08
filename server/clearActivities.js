const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Activity = require('./models/Activity');

dotenv.config({ path: '../.env' });

const clearActivities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const result = await Activity.deleteMany({});
        console.log(`Deleted ${result.deletedCount} activities.`);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error clearing activities:', error);
        process.exit(1);
    }
};

clearActivities();
