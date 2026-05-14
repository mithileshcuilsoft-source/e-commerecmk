const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 1. Import CORS
const router = require('./src/routes/index');
require('dotenv').config();

const app = express();

// 2. Enable CORS (Must be BEFORE routes)
app.use(cors()); 

app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerces')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', router);

// Default Route
app.get('/status', (req, res) => res.send('E-commerce API is running'));

const centrErrorHandler = require("./src/middlewares/centrErrorHandler");

// Error Handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

app.use(centrErrorHandler);

// 3. Change Port to 5000 to match your Next.js Axios baseURL
const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
