<template>
  <div class="task-list-container">
    <h2>Liste des Tâches</h2>
    <div class="task-summary">
      <p>Tâches En Cours : {{ pendingTasks }}</p>
      <p>Tâches Terminées : {{ completedTasks }}</p>
    </div>
    <div class="task-list">
      <div v-for="(task, index) in filteredTasks" :key="index" class="card">
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <div class="icon">
              <i class="bx bx-task"></i>
            </div>
            <div class="c-details">
              <h6 class="task-name">{{ task.task_name }}</h6>
              <span class="project-name"><strong>Projet :</strong> {{ task.nom_projet || "Non spécifié" }}</span>
              <span class="due-date">
                <strong>Échéance :</strong> {{ formatDate(task.date_echeance) }}
              </span>
            </div>
          </div>
          <div class="badge" :class="{ 'high-priority': task.priority === 'haute' }">
            <span>Priorité : {{ task.priority || "Non spécifiée" }}</span>
          </div>
        </div>
        <div class="mt-4">
          <p class="description">{{ task.description || "Pas de description disponible" }}</p>
          <div class="task-stats">
            <span><strong>Status :</strong> {{ task.status || "Non spécifié" }}</span>
            <span>
              <strong>Assigné à :</strong>
              {{ task.assigned_to && task.assigned_to.length > 0 ? task.assigned_to.join(", ") : "Non assigné" }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { EventBus } from "../utils/eventBus";

export default {
  name: "TaskList",
  data() {
    return {
      username: "",
      tasksByProject: {},
      projectNames: [],
    };
  },
  computed: {
    filteredTasks() {
      return Object.values(this.tasksByProject).flat();
    },
    completedTasks() {
      return this.filteredTasks.filter((task) => task.status === "terminée").length;
    },
    pendingTasks() {
      return this.filteredTasks.filter((task) => task.status !== "terminée").length;
    },
  },
  created() {
    this.loadUser();
    EventBus.on("projectsUpdated", (projectNames) => {
      this.projectNames = projectNames;
      this.fetchAllTasks();
    });
  },
  methods: {
    loadUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username) {
          this.username = storedUser.username;
        } else {
          this.$router.push("/login");
        }
      } catch {
        this.$router.push("/login");
      }
    },
    async fetchAllTasks() {
      for (const projectName of this.projectNames) {
        await this.fetchTasksForProject(projectName);
      }
    },
    async fetchTasksForProject(projectName) {
      try {
        const payload = { username: this.username, nom_projet: projectName };
        const response = await axios.post("http://127.0.0.1:5000/task/display", payload);
        if (response.data && Array.isArray(response.data.tasks)) {
          this.tasksByProject[projectName] = response.data.tasks.map((task) => ({
            ...task,
            date_echeance: task.due_date,
            nom_projet:projectName,
            assigned_to: task.assigned_to || [],
          }));
        }
      } catch (error) {
        console.error(`Erreur pour le projet ${projectName} :`, error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Non spécifiée";
      const date = new Date(dateString);
      return isNaN(date)
        ? "Format de date invalide"
        : date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    },
  },
};
</script>

<style scoped>
.task-list-container {
  padding: 20px;
  background-color: #f9f9f9;
  height: 100vh;
  overflow-y: auto;
}

.task-summary {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 20px;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  border: none;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.icon {
  width: 60px;
  height: 60px;
  background-color: #3498db;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.c-details {
  margin-left: 15px;
}

.c-details .task-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.c-details .project-name,
.c-details .due-date {
  display: block;
  margin-bottom: 5px;
}

.badge {
  background-color: #4caf50;
  color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.badge.high-priority {
  background-color: red;
}

.description {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.task-stats span {
  display: block;
  font-size: 14px;
  margin-top: 5px;
  color: #333;
}
</style>
