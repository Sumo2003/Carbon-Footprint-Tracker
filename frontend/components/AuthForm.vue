<template>
  <div class="auth-container">
    <h2>🔐 Login / Signup</h2>

    <input v-model="email" type="email" placeholder="Enter email" />
    <input v-model="password" type="password" placeholder="Enter password" />

    <div class="btn-group">
      <button @click="login">Login</button>
      <button @click="signup">Signup</button>
      <button v-if="user" @click="logout">Logout</button>
    </div>

    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { auth } from "@/firebaseConfig.js";   // 👈 ensure .js here
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

export default {
  name: "AuthForm",
  setup() {
    const email = ref("");
    const password = ref("");
    const message = ref("");
    const user = ref(null);

    // Listen for login state
    onMounted(() => {
      onAuthStateChanged(auth, (u) => {
        user.value = u;
      });
    });

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        message.value = "✅ Logged in successfully!";
      } catch (err) {
        message.value = "❌ " + err.message;
      }
    };

    const signup = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        message.value = "✅ Signup successful!";
      } catch (err) {
        message.value = "❌ " + err.message;
      }
    };

    const logout = async () => {
      try {
        await signOut(auth);
        message.value = "👋 Logged out!";
      } catch (err) {
        message.value = "❌ " + err.message;
      }
    };

    return { email, password, message, user, login, signup, logout };
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 2px solid #4caf50;
  border-radius: 12px;
  background: #f9fff9;
  text-align: center;
}
input {
  width: 90%;
  padding: 8px;
  margin: 6px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.btn-group {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  background: #45a049;
}
</style>
