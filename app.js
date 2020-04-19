require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const isAuth = require('./middleware/is-auth');

// TODO set up db as route
// TODO figure out why app.use() is working for /graphql but app.post/get is not!
// TODO figure out why /s3/upload is not working

const app = express();
const port = process.env.PORT || 8000;
// TODO do we need to move this in seperate file?
const db = mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4hv4e.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
);

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
// Configure the middleware
// bodyParser.json() returns a function that is passed as a param to app.use() as middleware
// which then allows us to send JSON to our express application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(isAuth);

// routes
app.use('/api/s3', require('./routes/s3'));
app.use('/api/graphql', require('./routes/graphql'));

// run the server
app.listen(port, () => {
  console.log(`App is running!`);
});
