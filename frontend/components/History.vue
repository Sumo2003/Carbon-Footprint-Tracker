<template>
  <div class="history-layout">
    <h2>📊 Your Carbon Footprint History</h2>

    <div v-if="loading" class="loading">Loading history...</div>

    <div v-else-if="data.length === 0" class="no-data">
      No records found. Start tracking today!
    </div>

    <div v-else class="content">
      <!-- Chart panel -->
      <div class="card chart-panel">
        <LineChart
          v-if="chartData"
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </div>

      <!-- Table panel -->
      <div class="card table-panel">
        <table class="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Travel (km)</th>
              <th>Electricity (kWh)</th>
              <th>Shopping (₹)</th>
              <th>Footprint (kg CO₂)</th>
              <th>Suggestions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in sortedData()" :key="r.id">
              <td>{{ i + 1 }}</td>
              <td>{{ formatDate(r.createdAt) }}</td>
              <td>{{ r.travelKm ?? '-' }}</td>
              <td>{{ r.electricityKWh ?? '-' }}</td>
              <td>{{ r.shoppingSpend ?? '-' }}</td>
              <td class="footprint">{{ formatNumber(r.footprintNumeric) }}</td>
              <td>
                <ul class="suggest-list">
                  <li v-for="(s, idx) in (r.suggestions || [])" :key="idx">
                    {{ s }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// ⚠️ logic untouched
import { ref, onMounted } from "vue";
import { db, auth } from "@/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineController,
} from "chart.js";
import { LineChart } from "vue-chart-3";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  LineController
);

export default {
  name: "History",
  components: { LineChart },
  setup() {
    // ⚠️ unchanged logic
    const data = ref([]);
    const loading = ref(true);
    const chartData = ref(null);

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Carbon Footprint Over Time (kg CO₂)" },
        tooltip: { mode: "index", intersect: false },
      },
      scales: {
        x: { display: true, title: { display: true, text: "Date" } },
        y: {
          display: true,
          title: { display: true, text: "kg CO₂" },
          beginAtZero: true,
        },
      },
    };

    function extractNumericFootprint(fp) {
      if (fp == null) return 0;
      if (typeof fp === "number") return fp;
      const m = String(fp).match(/[-+]?\d*\.?\d+/);
      return m ? parseFloat(m[0]) : 0;
    }

    function formatDate(d) {
      if (!d) return "-";
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toLocaleString();
    }

    function formatNumber(n) {
      const num = Number(n) || 0;
      return `${num.toFixed(2)} kg CO2`;
    }

    const loadHistory = async (user) => {
      try {
        loading.value = true;
        const q = query(
          collection(db, "footprints"),
          where("email", "==", user.email),
          orderBy("createdAt", "asc")
        );

        const snapshot = await getDocs(q);
        const rows = snapshot.docs.map((doc) => {
          const d = doc.data();
          const createdAt = d.createdAt?.toDate
            ? d.createdAt.toDate()
            : d.createdAt || null;
          const footprintNumeric = extractNumericFootprint(d.footprint);
          return { id: doc.id, ...d, createdAt, footprintNumeric };
        });

        data.value = rows;

        if (data.value.length > 0) {
          chartData.value = {
            labels: data.value.map((r) => formatDate(r.createdAt)),
            datasets: [
              {
                label: "Carbon Footprint (kg CO₂)",
                data: data.value.map((r) => r.footprintNumeric),
                fill: true,
                tension: 0.25,
                borderColor: "#4caf50",
                backgroundColor: "rgba(76,175,80,0.15)",
                pointRadius: 4,
              },
            ],
          };
        } else {
          chartData.value = null;
        }
      } catch (e) {
        console.error("Error loading history:", e);
        data.value = [];
        chartData.value = null;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) loadHistory(user);
        else loading.value = false;
      });
    });

    const sortedData = () =>
      [...data.value].sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

    return {
      data,
      loading,
      chartData,
      chartOptions,
      formatDate,
      formatNumber,
      sortedData,
    };
  },
};
</script>

<style scoped>
.history-layout {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 16px 40px;
  font-family: "Poppins", sans-serif;
}
h2 {
  margin-bottom: 20px;
  color: #2e7d32;
}
.loading,
.no-data {
  text-align: center;
  padding: 30px;
  color: #666;
}
.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}
.card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  border: 1px solid #eee;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: scale(1.02);
}
.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.history-table thead th {
  text-align: left;
  padding: 10px;
  background: #2e7d32;
  color: white;
  font-weight: 600;
}
.history-table tbody td {
  padding: 10px;
  border-bottom: 1px solid #f2f6f6;
  vertical-align: top;
}
.history-table tbody tr:nth-child(even) {
  background: #f9f9f9;
}
.footprint {
  font-weight: bold;
  color: #2196f3;
}
.suggest-list {
  margin: 0;
  padding-left: 18px;
}
.suggest-list li {
  margin-bottom: 6px;
}
@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
  .table-panel {
    max-height: 400px;
    overflow: auto;
  }
}
</style>
