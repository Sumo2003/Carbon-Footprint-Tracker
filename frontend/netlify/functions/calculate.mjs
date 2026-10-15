// Calculate carbon footprint + rule-based suggestions
export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const body = await req.json().catch(() => ({}));
  const travelKm = Number(body.travelKm) || 0;
  const electricityKwh = Number(body.electricityKwh ?? body.electricityKWh) || 0;
  const shoppingSpend = Number(body.shoppingSpend) || 0;

  // Dummy emission factors
  const travelEmission = travelKm * 0.2; // 0.2 kg CO2 per km
  const electricityEmission = electricityKwh * 0.5; // 0.5 kg CO2 per kWh
  const shoppingEmission = shoppingSpend * 0.1; // 0.1 kg CO2 per ₹ spent

  const footprint = travelEmission + electricityEmission + shoppingEmission;

  const suggestions = [];
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

  return Response.json({
    footprint: Number(footprint.toFixed(2)),
    suggestions,
  });
};

export const config = {
  path: "/api/calculate",
};
