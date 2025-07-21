const express = require('express');
const connectDB = require('./config/mongo'); // Your MongoDB connection function
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors()); // Allows CORS (important for Wix)
app.use(express.json());

// ✅ Connect MongoDB and define routes
connectDB().then((db) => {
  const chargers = db.collection('chargers'); // For listing available chargers
  const orders = db.collection('orders');     // For storing selected charger + user data

  // ✅ Test route
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

  // ✅ Save order with selected charger
  app.post('/api/save-order', async (req, res) => {
    try {
      const { firstName, lastName, email, phone, charger, timestamp } = req.body;

      if (!firstName || !lastName || !email || !phone || !charger) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await orders.insertOne({
        firstName,
        lastName,
        email,
        phone,
        charger,
        timestamp: timestamp || new Date().toISOString()
      });

      res.status(200).json({ message: "Order saved", id: result.insertedId });
    } catch (err) {
      console.error("❌ Failed to save order:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ✅ Add other routes as needed
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
