const express = require('express');
const connectDB = require('./config/mongo');
const cors = require('cors');
const { ObjectId } = require('mongodb');

const app = express();

// ✅ Middleware
app.use(cors()); // Allow cross-origin requests (important for Wix)
app.use(express.json());

// ✅ Connect MongoDB
connectDB().then((db) => {
  const chargers = db.collection('chargers');

  // ✅ Root test
  app.get('/', (req, res) => {
    res.send('Backend running!');
  });

  // ✅ Get all chargers
  app.get('/api/chargers', async (req, res) => {
    try {
      const allChargers = await chargers.find({}).toArray();
      res.json(allChargers);
    } catch (err) {
      console.error("❌ Failed to fetch chargers:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ✅ You can add more routes here (e.g., session logging, payment status update, etc.)
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
