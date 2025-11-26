<template>
  <div>
    <!-- Carbon Footprint Tracker Box -->
    <div class="form-container">
      <h2>🌍 Carbon Footprint Tracker</h2>

      <form @submit.prevent="calculateFootprint" class="form-grid">
        <div class="form-group">
          <label>🚗 Travel (Km)</label>
          <input v-model.number="travelKm" type="number" placeholder="Enter Km" />
        </div>

        <div class="form-group">
          <label>💡 Electricity (kWh)</label>
          <input v-model.number="electricityKWh" type="number" placeholder="Enter kWh" />
        </div>

        <div class="form-group">
          <label>🛍 Shopping Spend (₹)</label>
          <input v-model.number="shoppingSpend" type="number" placeholder="Enter amount" />
        </div>

        <button type="submit" class="submit-btn">Calculate</button>
      </form>

      <!-- Result Section -->
      <div v-if="result" class="result-box">
        <h3>🌱 Your Carbon Footprint: 
          <span class="highlight">{{ result.footprint }} kg CO₂</span>
        </h3>
        <ul class="suggestions">
          <li v-for="(s, index) in result.suggestions" :key="index">✔ {{ s }}</li>
        </ul>
      </div>
    </div>

    <!-- Badge Box -->
    <Badge v-if="result" :latestFootprint="result.footprint" />
  </div>
</template>

<script>
import axios from "axios";
import { db, auth } from "@/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Badge from "@/components/Badge.vue";

export default {
  name: "CarbonForm",
  components: { Badge },
  data() {
    return {
      travelKm: 0,
      electricityKWh: 0,
      shoppingSpend: 0,
      result: null,
    };
  },
  methods: {
    async calculateFootprint() {
      try {
        // 1. Backend API call
        const response = await axios.post("http://localhost:5000/calculate", {
          travelKm: this.travelKm,
          electricityKWh: this.electricityKWh,
          shoppingSpend: this.shoppingSpend,
        });

        // ✅ Ensure footprint is always number
        const footprintValue = Number(response.data.footprint) || 0;

        this.result = {
          footprint: footprintValue,
          suggestions: response.data.suggestions || [],
        };

        // 2. Firestore save if user logged in
        if (auth.currentUser) {
          await addDoc(collection(db, "footprints"), {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            travelKm: this.travelKm,
            electricityKWh: this.electricityKWh,
            shoppingSpend: this.shoppingSpend,
            footprint: footprintValue,
            suggestions: this.result.suggestions,
            createdAt: serverTimestamp(),
          });
          console.log("✅ Data saved to Firestore");
        } else {
          console.warn("⚠️ No user logged in. Data not saved.");
        }
      } catch (error) {
        console.error("❌ Error calculating footprint", error);
      }
    },
  },
};
</script>

<style scoped>
.form-container {
  max-width: 450px;
  margin: 20px auto;
  padding: 25px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  font-family: "Poppins", sans-serif;
  border: 1px solid #e0e0e0;
}
h2 {
  margin-bottom: 20px;
  color: #2e7d32;
  text-align: center;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: border 0.2s;
}
input:focus {
  border-color: #2e7d32;
  outline: none;
}
.submit-btn {
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  font-weight: 600;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.3s ease;
}
.submit-btn:hover {
  transform: scale(1.03);
  background: linear-gradient(135deg, #388e3c, #1b5e20);
}
.result-box {
  margin-top: 20px;
  padding: 15px;
  background: #f0fdf4;
  border: 1px solid #c8e6c9;
  border-radius: 12px;
}
.result-box h3 {
  margin-bottom: 10px;
}
.highlight {
  color: #2196f3;
  font-weight: bold;
}
.suggestions {
  margin: 0;
  padding-left: 18px;
}
.suggestions li {
  margin-bottom: 6px;
  color: #444;
}
</style>
