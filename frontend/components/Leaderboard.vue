<template>
  <div class="leaderboard">
    <h2>🏆 Carbon Footprint Leaderboard</h2>

    <div v-if="loading" class="loading">Loading leaderboard...</div>

    <ul v-else>
      <li
        v-for="(entry, index) in leaderboard"
        :key="entry.uid"
        :class="{'top-user': index === 0}"
      >
        <span class="rank">
          <span v-if="index === 0">🥇</span>
          <span v-else-if="index === 1">🥈</span>
          <span v-else-if="index === 2">🥉</span>
          <span v-else>#{{ index + 1 }}</span>
        </span>

        <span class="email">{{ entry.email }}</span>

        <span class="score">
          {{ entry.avgFootprint.toFixed(2) }} kg CO₂
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "Leaderboard",
  data() {
    return {
      leaderboard: [],
      loading: true,
    };
  },
  async created() {
    try {
      const footprintsRef = collection(db, "footprints");
      const snapshot = await getDocs(footprintsRef);

      const userData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        const footprint = parseFloat(data.footprint);

        if (!userData[uid]) {
          userData[uid] = {
            total: 0,
            count: 0,
            email: data.email || "Anonymous",
          };
        }

        userData[uid].total += footprint;
        userData[uid].count += 1;
      });

      const leaderboardArray = Object.keys(userData).map((uid) => ({
        uid,
        email: userData[uid].email,
        avgFootprint: userData[uid].total / userData[uid].count,
      }));

      leaderboardArray.sort((a, b) => a.avgFootprint - b.avgFootprint);

      this.leaderboard = leaderboardArray;
      this.loading = false;
    } catch (err) {
      console.error("❌ Error fetching leaderboard:", err);
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.leaderboard {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 16px;
  background: #f0f8ff;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}
.loading {
  text-align: center;
  color: #555;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #ddd;
  transition: transform 0.2s ease;
}
li:hover {
  transform: scale(1.02);
}
li.top-user {
  background: #e8f5e9;
  border: 2px solid #2e7d32;
}
.rank {
  font-weight: bold;
  width: 50px;
  text-align: center;
}
.email {
  flex: 1;
  color: #333;
}
.score {
  font-weight: bold;
  color: #2196f3;
}
</style>
