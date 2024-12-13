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
            <button @click="toggleComments(task.task_name)" class="btn comment-btn">
              {{ taskComments[task.task_name] ? "Masquer les Commentaires" : "Commentaires" }}
            </button>
          </div>
          <div v-if="taskComments[task.task_name]" class="comments-section">
            <h5>Commentaires :</h5>
            <ul>
              <li v-for="(comment, idx) in taskComments[task.task_name]" :key="idx">
                <strong>{{ comment.created_at }} :</strong> {{ comment.comment || "Pas de contenu" }}
              </li>
            </ul>
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
      taskComments: {}, // Stockage des commentaires par tâche
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
            nom_projet: projectName,
          }));
        }
      } catch (error) {
        console.error(`Erreur pour le projet ${projectName}` , error);
      }
    },
    async toggleComments(taskName) {
      // Si les commentaires sont déjà chargés, supprimez-les pour replier la section
      if (this.taskComments[taskName]) {
        delete this.taskComments[taskName];
        this.taskComments = { ...this.taskComments }; // Rafraîchit la réactivité
        return;
      }

      // Sinon, chargez les commentaires
      try {
        const payload = { username: this.username, task_name: taskName };
        const response = await axios.post("http://127.0.0.1:5000/task/comments", payload);

        if (response.data && Array.isArray(response.data.comments)) {
          console.log("Commentaires reçus pour", taskName, response.data.comments);
          this.taskComments = {
            ...this.taskComments,
            [taskName]: response.data.comments,
          };
          
        } else {
          console.error("Aucun commentaire trouvé.", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commentaires :", error);
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
/* Conteneur principal */
.task-list-container {
  padding: 30px;
  background-color: #f0f4f8;
  min-height: 100vh;
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
}

/* Titre principal */
.task-list-container h2 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
}

/* Résumé des tâches */
.task-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 500;
}

.task-summary p {
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: #555;
}

/* Liste des cartes */
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

/* Carte */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Contenu des détails */
.d-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.c-details {
  margin-left: 15px;
}

.c-details .task-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.c-details .project-name,
.c-details .due-date {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

/* Badges */
.badge {
  background-color: #4caf50;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
}

.badge.high-priority {
  background-color: #e74c3c;
}

/* Description */
.description {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

/* Statistiques */
.task-stats span {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
  display: block;
}

.comment-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
}

.comment-btn:hover {
  background-color: #2980b9;
}

.comments-section {
  margin-top: 10px;
  background: #f4f4f4;
  border-radius: 5px;
  padding: 10px;
}

.comments-section ul {
  list-style-type: none;
  padding: 0;
}

.comments-section li {
  margin-bottom: 5px;
}
</style>
