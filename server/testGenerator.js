const axios = require('axios');

const testApi = async () => {
    try {
        // We can't easily test the protected route without a token here, 
        // but we can test the internal generator function.
        const { generateDailyActivities } = require('./utils/aiActivityGenerator');
        const mongoose = require('mongoose');
        const dotenv = require('dotenv');
        dotenv.config({ path: '../.env' });
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        const activities = await generateDailyActivities('Telugu', 1);
        console.log('Activities for Telugu Day 1:', activities.length);
        console.log('First word:', activities[0]?.word);
        
        mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
};

testApi();
