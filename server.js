// jshint esversion:6

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// Routes

app.use('/user', require('./routes/userRouter'));

app.use('/api', require('./routes/categoryRouter'));

app.use('/api', require('./routes/upload'));

app.use('/api', require('./routes/productRouter'));

app.use('/api', require('./routes/paymentRouter'));

// MongoDB connect

const URI = process.env.MONGODB_URL;
// const URI = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
  }
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
