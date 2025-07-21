const express = require('express');
const { ObjectId } = require('mongodb');
const connectDB = require('./config/mongo');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB and define routes
connectDB().then((db) => {
  const chargers = db.collection('chargers');
  const orders = db.collection('orders');

  // ✅ Test Route
  app.get('/', (req, res) => {
    res.send('🚀 Backend running!');
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

  // ✅ Save new order with selected charger (initial placeholder user info)
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

  // ✅ Get order by ID (used by payment page to fetch saved charger)
  app.get('/api/get-order/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const order = await orders.findOne({ _id: new ObjectId(id) });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json(order);
    } catch (err) {
      console.error("❌ Failed to fetch order:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ✅ Update order with user data on payment page
  app.patch('/api/update-order/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { firstName, lastName, email, phone } = req.body;

      const result = await orders.updateOne(
        { _id: new ObjectId(id) },
        { $set: { firstName, lastName, email, phone } }
      );

      res.json({ message: "Order updated", result });
    } catch (err) {
      console.error("❌ Failed to update order:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
