<template>
    <div class="badge-container">
      <h2>🏅 Your Badge</h2>
      <div v-if="badge">
        <div class="badge-card">
          <span class="emoji">{{ badge.emoji }}</span>
          <h3>{{ badge.title }}</h3>
          <p>{{ badge.description }}</p>
        </div>
      </div>
      <div v-else>
        <p>No footprint data yet. Calculate your footprint to earn badges!</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Badge",
    props: {
      latestFootprint: {
        type: Number,
        required: false,
      },
    },
    computed: {
      badge() {
        if (this.latestFootprint == null) return null;
  
        if (this.latestFootprint < 100) {
          return {
            emoji: "🌱",
            title: "Eco Hero",
            description: "Amazing! Your footprint is super low 🌍",
          };
        } else if (this.latestFootprint >= 100 && this.latestFootprint < 300) {
          return {
            emoji: "🌿",
            title: "Conscious Citizen",
            description: "Good job! Keep improving your sustainability efforts 💚",
          };
        } else {
          return {
            emoji: "🔥",
            title: "Needs Improvement",
            description: "Your footprint is high. Try to reduce emissions ⚠️",
          };
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .badge-container {
    max-width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 2px solid #4caf50;
    border-radius: 12px;
    background: #f0fff4;
    text-align: center;
  }
  .badge-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .emoji {
    font-size: 40px;
  }
  </style>
  