const express = require('express');
const connectDB = require('./config/db');
const app = express();
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
//Connect Database
connectDB();

//Body pursing middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API is running'));

//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//process.env will look for an environment variable called "Port" to use when we deploy to Heroku that's gonna get
//the port number and locally, I am using 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
