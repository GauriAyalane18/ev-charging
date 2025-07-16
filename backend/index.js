const express = require('express');
const connectDB = require('./config/mongo');

const app = express();
app.use(express.json());

// Connect DB
connectDB();

// Your routes
app.get('/', (req, res) => {
  res.send('Backend running!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
