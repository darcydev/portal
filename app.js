require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const graphqlRouter = require('./routes/graphql');
const s3Router = require('./routes/s3');
const isAuth = require('./middleware/is-auth');

const app = express();
const port = process.env.PORT || 8000;
const db = mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-4hv4e.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(isAuth);

// API routes
app.use('/api/graphql', graphqlRouter);
app.use('/api/s3', s3Router);

// run the server
app.listen(port, () => {
  console.log(`App is running!`);
});
