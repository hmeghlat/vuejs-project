<template>
  <div class="time-tracking-list">
    <h2>Suivi du Temps</h2>
    <div v-if="timeTrackingEntries.length === 0" class="empty-message">
      <p>Aucune entrée de suivi de temps trouvée.</p>
    </div>
    <ul v-else>
      <li v-for="entry in timeTrackingEntries" :key="entry.start_time">
        <p><strong>Tâche :</strong> {{ entry.task_name }}</p>
        <p><strong>Début :</strong> {{ formatDate(entry.start_time) }}</p>
        <p><strong>Fin :</strong> {{ formatDate(entry.end_time) }}</p>
        <p><strong>Durée :</strong> {{ entry.duration_minutes }} minutes</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TimeTrackingList",
  data() {
    return {
      timeTrackingEntries: [],
    };
  },
  created() {
    this.fetchTimeTrackingEntries();
  },
  methods: {
    async fetchTimeTrackingEntries() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.username) {
          alert("Utilisateur non connecté !");
          return;
        }
        const response = await axios.post("http://127.0.0.1:5000/task/time_tracking", {
          username: storedUser.username,
        });
        this.timeTrackingEntries = response.data.time_tracking || [];
      } catch (error) {
        console.error("Erreur lors de la récupération du suivi de temps :", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Non spécifiée";
      const date = new Date(dateString);
      return isNaN(date) ? "Date invalide" : date.toLocaleString("fr-FR");
    },
  },
};
</script>

<style scoped>
.time-tracking-list {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.empty-message {
  text-align: center;
  color: #999;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
