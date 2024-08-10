const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./models/user'); 

const app = express();
const PORT = 3000;


app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Assignment', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).send('User registered');
    } catch (error) {
        console.error('Error during user registration:', error); 
        res.status(500).send('Error registering user');
    }
});

app.get('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.send('Login successful');
        } else {
            res.status(400).send('Invalid password');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
