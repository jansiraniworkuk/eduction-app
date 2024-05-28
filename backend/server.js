const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://tutoracademy:<password>@learningapplication.uori5vg.mongodb.net/?retryWrites=true&w=majority&appName=LearningApplication';

// Replace <password> with the actual password for the tutoracademy user
const mongoURIWithPassword = mongoURI.replace('<password>', encodeURIComponent('Learning@100'));

mongoose.connect(mongoURIWithPassword, {
    serverSelectionTimeoutMS: 5000  // Adjust the timeout as needed
}).then(() => {
    console.log('MongoDB database connection established successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    level: { type: Number, default: 1 },
    scores: { type: Array, default: [] }
});

const User = mongoose.model('User', userSchema);

// Create 10 guest users
(async () => {
    for (let i = 1; i <= 10; i++) {
        try {
            await User.findOneAndUpdate(
                { username: `guest${i}` },
                { username: `guest${i}`, level: 1, scores: [] },
                { upsert: true, new: true }
            );
        } catch (err) {
            console.error(`Error creating/updating guest${i}:`, err);
        }
    }
    console.log('Guest users created or updated');
})();

// Routes
app.post('/login', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/score', async (req, res) => {
    const { username, score } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).send('User not found');

        user.scores.push(score);
        if (score === 10 && user.scores.slice(-3).every(s => s === 10)) {
            user.level = 2;
        }

        await user.save();
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
