<template>
    <div class="dashboard">
      <h2>📊 Your Dashboard</h2>
  
      <div v-if="loading" class="loading">Loading your data...</div>
  
      <div v-else class="grid">
        <!-- Total Records -->
        <div class="card">
          <h3>📁 Total Records</h3>
          <p>{{ totalFootprints }}</p>
        </div>
  
        <!-- Latest Footprint -->
        <div class="card">
          <h3>🌱 Latest Footprint</h3>
          <p v-if="latestFootprint !== null">
            {{ latestFootprint.toFixed(2) }} kg CO₂
          </p>
          <p v-else>-</p>
        </div>
  
        <!-- Badge -->
        <div class="card">
          <h3>🏅 Unlocked Badge</h3>
          <Badge v-if="latestFootprint !== null" :latestFootprint="latestFootprint" />
          <p v-else>No badge yet</p>
        </div>
  
        <!-- Summary -->
        <div class="card highlight">
          <h3>✨ Summary</h3>
          <p>
            You’ve saved <strong>{{ totalFootprints * 2 }}</strong> kg CO₂ so far 🎉
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { db, auth } from "@/firebaseConfig";
  import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
  import { onAuthStateChanged } from "firebase/auth";
  import Badge from "@/components/Badge.vue";
  
  export default {
    name: "Dashboard",
    components: { Badge },
    setup() {
      const loading = ref(true);
      const totalFootprints = ref(0);
      const latestFootprint = ref(null);
  
      const loadData = async (user) => {
        try {
          const q = query(
            collection(db, "footprints"),
            where("email", "==", user.email),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          totalFootprints.value = snapshot.size;
  
          if (!snapshot.empty) {
            const first = snapshot.docs[0].data();
            latestFootprint.value = Number(first.footprint) || 0;
          }
        } catch (e) {
          console.error("❌ Error loading dashboard:", e);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) loadData(user);
          else loading.value = false;
        });
      });
  
      return { loading, totalFootprints, latestFootprint };
    },
  };
  </script>
  
  <style scoped>
  .dashboard {
    max-width: 1000px;
    margin: 20px auto;
    padding: 20px;
    font-family: "Poppins", sans-serif;
  }
  h2 {
    margin-bottom: 20px;
    color: #2e7d32;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }
  .card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    text-align: center;
    border: 1px solid #eee;
    transition: transform 0.2s ease;
  }
  .card:hover {
    transform: scale(1.03);
  }
  .card h3 {
    margin-bottom: 8px;
    color: #333;
  }
  .highlight {
    background: linear-gradient(135deg, #a8e6cf, #dcedc1);
    color: #1b5e20;
  }
  .loading {
    text-align: center;
    padding: 30px;
    color: #666;
  }
  </style>
  