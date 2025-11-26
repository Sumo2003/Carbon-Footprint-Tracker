<template>
  <div>
    <h1>🌱 Carbon Tracker App</h1>

    <!-- Show login if not authenticated -->
    <AuthForm v-if="!user" />

    <!-- Show app features if logged in -->
    <div v-else>
      <!-- ✅ Navigation -->
      <nav class="nav">
        <button @click="activeTab = 'form'">Form</button>
        <button @click="activeTab = 'history'">History</button>
        <button @click="activeTab = 'leaderboard'">Leaderboard</button>
        <button @click="activeTab = 'dashboard'">Dashboard</button>
      </nav>

      <!-- ✅ Conditional rendering -->
      <CarbonForm v-if="activeTab === 'form'" />
      <History v-if="activeTab === 'history'" />
      <Leaderboard v-if="activeTab === 'leaderboard'" />
      <Dashboard v-if="activeTab === 'dashboard'" />
    </div>
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import AuthForm from "@/components/AuthForm.vue";
import CarbonForm from "@/components/CarbonForm.vue";
import Leaderboard from "@/components/Leaderboard.vue";
import History from "@/components/History.vue";
import Dashboard from "@/components/Dashboard.vue"; // ✅ new

export default {
  components: { AuthForm, CarbonForm, Leaderboard, History, Dashboard },
  data() {
    return {
      user: null,
      activeTab: "form", // ✅ default tab
    };
  },
  created() {
    onAuthStateChanged(auth, (u) => {
      this.user = u;
    });
  },
};
</script>

<style scoped>
.nav {
  margin: 15px 0;
}
.nav button {
  margin-right: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2e7d32;
  color: white;
  cursor: pointer;
}
.nav button:hover {
  background: #1b5e20;
}
</style>
