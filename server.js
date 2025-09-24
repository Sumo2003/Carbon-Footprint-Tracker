const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});

// Calculate carbon footprint + AI suggestions
app.post('/calculate', (req, res) => {
  const { travelKm = 0, electricityKwh = 0, shoppingSpend = 0 } = req.body;

  // Dummy emission factors
  const travelEmission = travelKm * 0.2;       // 0.2 kg CO2 per km
  const electricityEmission = electricityKwh * 0.5; // 0.5 kg CO2 per kWh
  const shoppingEmission = shoppingSpend * 0.1;     // 0.1 kg CO2 per ₹ spent

  const footprint = travelEmission + electricityEmission + shoppingEmission;

  // Rule-based suggestions
  let suggestions = [];
  if (travelKm > 50) {
    suggestions.push("Try using public transport 2x per week to save ~120kg CO2/year.");
  }
  if (electricityKwh > 100) {
    suggestions.push("Switching to LED bulbs could reduce your footprint by 5%.");
  }
  if (shoppingSpend > 5000) {
    suggestions.push("Consider buying second-hand or sustainable products to cut CO2 impact.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Great job! Keep maintaining a sustainable lifestyle 🌱.");
  }

  res.json({
    footprint: `${footprint.toFixed(2)} kg CO2`,
    suggestions
  });
});

// Placeholder leaderboard (later connect with Firebase Firestore)
app.get('/leaderboard', (req, res) => {
  const dummyLeaderboard = [
    { name: "Aisha", score: 95 },
    { name: "Ravi", score: 88 },
    { name: "You", score: 80 }
  ];
  res.json(dummyLeaderboard);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
