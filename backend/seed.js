// seed.js

const connectToMongo = require("./config/mongo"); // Adjust path if needed

async function insertDemoChargers() {
  const db = await connectToMongo();
  const chargers = db.collection("chargers");

  const demoData = [
    {
      chargerId: "CHG-001",
      chargerName: "Tesla Supercharger",
      stationName: "Amsterdam Central",
      status: "on",
      timestamp: new Date(),
      paymentStatus: "paid"
    },
    {
      chargerId: "CHG-002",
      chargerName: "IONITY Fast Charger",
      stationName: "Berlin Mitte",
      status: "off",
      timestamp: new Date(),
      paymentStatus: "unpaid"
    },
    {
      chargerId: "CHG-003",
      chargerName: "EVBox Charger",
      stationName: "Rotterdam Centrum",
      status: "on",
      timestamp: new Date(),
      paymentStatus: "pending"
    }
  ];

  await chargers.insertMany(demoData);
  console.log("✅ Demo charger data inserted!");
  process.exit();
}

insertDemoChargers();
