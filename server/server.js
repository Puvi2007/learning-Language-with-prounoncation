const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: '../.env' });
connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'API running!' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/language', require('./routes/language'));

app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});