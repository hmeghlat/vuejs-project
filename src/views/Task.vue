<template>
  <div :class="['task-page', { 'sidebar-open': isSidebarOpen }]">
    <!-- Barre latérale -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />

    <!-- Contenu principal -->
    <div class="main-content">
      <header class="tasks-header">
        <h1>Gestion des Tâches</h1>
        <!-- Bouton Ajouter (visible uniquement pour les administrateurs et chefs d'équipe) -->
        <button
          v-if="hasPermission('create')"
          @click="showCreateTaskModal = true"
          class="add-task-btn"
        >
          + Ajouter une Tâche
        </button>
      </header>

      <section class="tasks-list">
        <div v-if="tasks.length === 0" class="empty-message">
          <i class="fas fa-tasks"></i> Aucune tâche disponible.
        </div>
        <div v-else class="task-cards">
          <div v-for="task in tasks" :key="task.id" class="task-card">
            <div class="task-header">
              <h2>{{ task.task_name }}</h2>
              <p><strong>Projet :</strong> {{ task.nom_projet || "Non spécifié" }}</p>
            </div>
            <p>{{ task.description || "Pas de description" }}</p>
            <p><strong>Date d'Échéance :</strong> {{ formatDate(task.date_echeance) }}</p>
            <p><strong>Priorité :</strong> {{ task.priority }}</p>
            <p><strong>État :</strong> {{ task.status }}</p>
            <p><strong>Assigné à :</strong> {{ task.assigned_to.map(user => user.username || user).join(', ') }}</p>
            <p>
              
              <button @click="fetchDependencies(task.task_name)" class="btn fetch-dependencies-btn">
                Voir les Dépendances
              </button>
            
              </p>



            <div class="actions">
              <!-- Boutons pour le suivi du temps -->
              <button
                v-if="!task.isTrackingTime"
                @click="startTrackingTime(task)"
                class="btn time-track-btn"
              >
                Démarrer le suivi du temps
              </button>
              <button
                v-if="task.isTrackingTime"
                @click="stopTrackingTime(task)"
                class="btn time-stop-btn"
              >
                Arrêter le suivi du temps
              </button>

              
              <!-- Bouton Ajouter un Commentaire -->
              <button
                v-if="hasPermission('comment')"
                @click="openCommentModal(task.task_name)"
                class="btn comment-btn"
              >
                Ajouter un Commentaire
              </button>
              <!-- Bouton Terminer -->
              <button
                v-if="task.status !== 'terminée' && hasPermission('edit')"
                @click="updateTaskState(task.task_name, 'terminée')"
                class="btn complete-btn"
              >
                Terminer
              </button>
              <!-- Bouton Ajouter Dépendance -->
              <button
                v-if="hasPermission('edit')"
                @click="openDependencyModal(task.task_name)"
                class="btn dependency-btn"
              >
                Ajouter Dépendance
              </button>
            </div>
          </div>
        </div>
      </section>
      <!-- Popup pour les dépendances -->
      <div v-if="showDependencyPopup" class="popup-overlay">
        <div class="popup-content">
          <h3>Dépendances</h3>
          <p>{{ dependencyMessage }}</p>
          <button @click="closeDependencyPopup" class="btn close-popup-btn">Fermer</button>
        </div>
      </div>

      <!-- Liste du suivi du temps -->
      <TimeTrackingList :timeTrackingData="timeTrackingData" />

      <!-- Modal pour ajouter une tâche -->
      <div v-if="showCreateTaskModal" class="modal">
        <div class="modal-content">
          <h3>Créer une Nouvelle Tâche</h3>
          <form @submit.prevent="saveTask">
            <label>
              Nom de la Tâche :
              <input type="text" v-model="currentTask.task_name" required />
            </label>
            <label>
              Projet :
              <select v-model="currentTask.nom_projet" required>
                <option v-for="project in projects" :key="project.id" :value="project.name">
                  {{ project.name }}
                </option>
              </select>
            </label>
            <label>
              Description :
              <textarea v-model="currentTask.description" required></textarea>
            </label>
            <label>
              Date d'Échéance :
              <input type="date" v-model="currentTask.date_echeance" required />
            </label>
            <label>
              Assigné à :
              <input
                type="text"
                v-model="assignedToInput"
                placeholder="Séparez les noms par des virgules"
              />
            </label>
            <label>
              Priorité :
              <select v-model="currentTask.priority" required>
                <option value="haute">Haute</option>
                <option value="moyenne">Moyenne</option>
                <option value="basse">Basse</option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="submit" class="btn save-btn">Enregistrer</button>
              <button type="button" @click="closeModal" class="btn cancel-btn">Annuler</button>
            </div>
          </form>
        </div>
      </div>
      

      <!-- Modal pour ajouter un commentaire -->
      <div v-if="showCommentModal" class="modal">
        <div class="modal-content">
          <h3>Ajouter un Commentaire</h3>
          <form @submit.prevent="addComment">
            <label>
              Commentaire :
              <textarea v-model="newComment" required></textarea>
            </label>
            <div class="modal-actions">
              <button type="submit" class="btn save-btn">Enregistrer</button>
              <button type="button" @click="closeCommentModal" class="btn cancel-btn">Annuler</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal pour ajouter une dépendance -->
      <div v-if="showDependencyModal" class="modal">
        <div class="modal-content">
          <h3>Ajouter une Dépendance</h3>
          <form @submit.prevent="addDependency">
            <label>
              Tâche Prioritaire :
              <select v-model="dependency.task_name_priority" required>
                <option v-for="task in tasks" :key="task.id" :value="task.task_name">
                  {{ task.task_name }}
                </option>
              </select>
            </label>
            <label>
              Dépendance :
              <select v-model="dependency.task_name_dep" required>
                <option v-for="task in tasks" :key="task.id" :value="task.task_name">
                  {{ task.task_name }}
                </option>
              </select>
            </label>
            <div class="modal-actions">
              <button type="submit" class="btn save-btn">Ajouter</button>
              <button type="button" @click="closeDependencyModal" class="btn cancel-btn">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import TimeTrackingList from "../components/TimeTrackingList.vue";
import axios from "axios";

export default {
  name: "Task",
  components: { Sidebar,TimeTrackingList },
  data() {
    return {
      user: {
        username: "",
        role: "",
      },
      isSidebarOpen: false,
      tasks: [],
      projects: [],
      showDependencyPopup: false,
      dependencyMessage: "",
      trackingStartTime: {},
      showCreateTaskModal: false,
      showDependencyModal: false,
      showCommentModal: false,
      dependency: {
        task_name_priority: "",
        task_name_dep: "",
      },
      isEditing: false,
      currentTask: {
        id: null,
        task_name: "",
        nom_projet: "",
        description: "",
        priority: "moyenne",
        status: "A faire",
        date_echeance: "",
        assigned_to: [],
      },
      newComment: "",
      selectedTaskName: "",
      assignedToInput: "",
    };
  },
  created() {
    this.loadUser();
    this.fetchProjects();
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    loadUser() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.username && storedUser.role) {
          this.user.username = storedUser.username;
          this.user.role = storedUser.role;
        } else {
          alert("Utilisateur non connecté !");
          this.$router.push("/login");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        this.$router.push("/login");
      }
    },

    formatDate(dateString) {
      if (!dateString) return "Non spécifiée";
      const date = new Date(dateString);
      if (isNaN(date)) return "Date invalide";
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    openDependencyModal(taskName) {
      this.showDependencyModal = true;
      this.dependency.task_name_priority = taskName;
    },

    openCommentModal(taskName) {
      this.showCommentModal = true;
      this.selectedTaskName = taskName;
      this.newComment = "";
    },

    async fetchProjects() {
      try {
        const response = await axios.post("http://127.0.0.1:5000/project/display", {
          username: this.user.username,
          display_type: "projects",
        });
        if (response.status === 200 && Array.isArray(response.data.projects)) {
          this.projects = response.data.projects;
          this.fetchTasks();
        } else {
          console.error("Erreur lors de la récupération des projets :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error);
      }
    },

    async fetchTasks() {
      try {
        const tasks = [];
        for (const project of this.projects) {
          const response = await axios.post("http://127.0.0.1:5000/task/display", {
            username: this.user.username,
            nom_projet: project.name,
          });

          for (const task of response.data.tasks) {
            // Appel à l'API pour récupérer les membres assignés à la tâche
            const membersResponse = await axios.post(
              "http://127.0.0.1:5000/task/get_assigned_users",
              {
                type: "task",
                name: task.task_name,
              }
            );

            tasks.push({
              ...task,
              nom_projet: project.name,
              date_echeance: task.due_date,
              assigned_to: membersResponse.data.users || [], // Utilisateurs assignés
            });
          }
        }
        this.tasks = tasks;
      } catch (error) {
        console.error("Erreur lors de la récupération des tâches ou des membres assignés :", error);
      }
    },

    hasPermission(action) {
      const permissions = {
        utilisateur: ["comment"],
        "chef d'équipe": ["create", "edit", "delete", "comment"],
        administrateur: ["create", "edit", "delete", "comment"],
      };
      return permissions[this.user.role]?.includes(action) || false;
    },

    async saveTask() {
      if (!this.hasPermission("create")) {
        alert("Vous n'avez pas la permission de créer une tâche.");
        return;
      }

      try {
        const payload = {
          username: this.user.username,
          task_name: this.currentTask.task_name,
          nom_projet: this.currentTask.nom_projet,
          description: this.currentTask.description,
          priority: this.currentTask.priority,
          status: this.currentTask.status,
          date_echeance: this.currentTask.date_echeance,
          assigned_to: this.assignedToInput.split(",").map((m) => m.trim()),
        };
        const response = await axios.post("http://127.0.0.1:5000/task/create", payload);
        if (response.status === 201) {
          alert("Tâche créée avec succès !");
          this.closeModal();
          this.fetchTasks();
        } else {
          alert(response.data.message || "Erreur lors de la création de la tâche.");
        }
      } catch (error) {
        console.error("Erreur lors de la création de la tâche :", error);
      }
    },

    async updateTaskState(taskName, newStatus) {
      if (!this.hasPermission("edit")) {
        alert("Vous n'avez pas la permission de modifier cette tâche.");
        return;
      }

      try {
        const response = await axios.post("http://127.0.0.1:5000/task/update_state", {
          username: this.user.username,
          task_name: taskName,
          status: newStatus,
        });
        if (response.status === 200) {
          alert(response.data.message);
          this.fetchTasks();
        } else {
          console.error("Erreur lors de la mise à jour de l'état de la tâche :", response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'état de la tâche :", error);
      }
    },

    async addDependency() {
      try {
        const payload = {
          username: this.user.username,
          task_name_priority: this.dependency.task_name_priority,
          task_name_dep: this.dependency.task_name_dep,
        };

        const response = await axios.post(
          "http://127.0.0.1:5000/task/add_dependency",
          payload,
          {
            headers: {
             "Content-Type": "application/json",
             },
          }
        );

        if (response.status === 201) {
          alert("Dépendance ajoutée avec succès !");
          this.fetchTasks();
        } else {
          alert(response.data.message || "Erreur lors de l'ajout de la dépendance.");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de la dépendance :", error);
        alert("Une erreur est survenue. Veuillez vérifier les informations et réessayer.");
      } finally {
        this.closeDependencyModal();
      }
    },

    async fetchDependencies(taskName) {
      try {
        const payload = { username: this.user.username, task_name: taskName };
        const response = await axios.post("http://127.0.0.1:5000/task/dependencies", payload);
        if (response.data && response.data.message) {
          this.dependencyMessage = response.data.message;
          this.showDependencyPopup = true;
        } else {
          this.dependencyMessage = "Aucune dépendance trouvée.";
          this.showDependencyPopup = true;
        }
      } catch (error) {
        this.dependencyMessage = "Erreur lors de la récupération des dépendances.";
        this.showDependencyPopup = true;
      }
    },
    closeDependencyPopup() {
      this.showDependencyPopup = false;
    },
    



    async addComment() {
      if (!this.newComment.trim()) {
        alert("Veuillez saisir un commentaire.");
        return;
      }

      try {
        const payload = {
          username: this.user.username,
          task_name: this.selectedTaskName,
          comment: this.newComment,
        };

        const response = await axios.post("http://127.0.0.1:5000/task/comment", payload);

        if (response.status === 201) {
          alert("Commentaire ajouté avec succès !");
          this.closeCommentModal();
          this.fetchTasks();
        } else {
          alert(response.data.message || "Erreur lors de l'ajout du commentaire.");
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    },

    // Suivi du temps
    startTrackingTime(task) {
      const now = new Date().toISOString();
      this.trackingStartTime[task.task_name] = now; // Enregistre le début
      task.isTrackingTime = true;
      alert(`Suivi démarré pour la tâche "${task.task_name}" à ${new Date().toLocaleTimeString()}`);
    },

    async stopTrackingTime(task) {
        const startTime = this.trackingStartTime[task.task_name];
        if (!startTime) {
          alert("Le suivi n'a pas démarré !");
          return;
        }

        const endTime = new Date().toISOString();
        const payload = {
          username: this.user.username,
          task_name: task.task_name,
          start_time: startTime,
          end_time: endTime,
        };

        try {
          const response = await axios.post("http://127.0.0.1:5000/task/time/track", payload);
          if (response.status === 201) {
            alert(`Temps enregistré avec succès pour la tâche "${task.task_name}" !`);
            delete this.trackingStartTime[task.task_name];
            task.isTrackingTime = false;
          } else {
            console.error("Erreur lors de l'enregistrement du temps :", response.data);
            alert(response.data.message || "Erreur lors de l'enregistrement du temps.");
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
          alert("Impossible de se connecter au serveur.");
        }
      },
    

    closeCommentModal() {
      this.showCommentModal = false;
      this.selectedTaskName = "";
      this.newComment = "";
    },

    closeModal() {
      this.showCreateTaskModal = false;
      this.isEditing = false;
      this.currentTask = {
        id: null,
        task_name: "",
        nom_projet: "",
        description: "",
        priority: "moyenne",
        status: "A faire",
        date_echeance: "",
        assigned_to: [],
      };
      this.assignedToInput = "";
    },

    closeDependencyModal() {
      this.showDependencyModal = false;
      this.dependency = {
        task_name_priority: "",
        task_name_dep: "",
      };
    },
  },
};
</script>

<style scoped>
/* Conteneur principal */
.task-page {
  display: flex;
  background-color: #f9f9fb; /* Fond léger et neutre */
  min-height: 100vh;
  padding: 20px;
}

/* Contenu principal */
.main-content {
  flex-grow: 1;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

/* Entête des tâches */
.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tasks-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #1a1a1a; /* Noir doux pour une meilleure lisibilité */
}

.add-task-btn {
  background:#007bff; /* Bleu doux */
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.add-task-btn:hover {
  background:#007bff; /* Variation plus sombre du bleu */
  transform: scale(1.05);
}

/* Cartes des tâches */
.task-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.task-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.task-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.task-header h2 {
  font-size: 20px;
  color: #1a1a1a; /* Noir doux */
  margin-bottom: 10px;
}

.task-card p {
  margin: 5px 0;
  color: #4a4a4a; /* Texte légèrement adouci */
}

/* Boutons */
.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.task-card button {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

/* Boutons uniformisés */
.task-card .time-track-btn,
.task-card .comment-btn,
.task-card .dependency-btn {
  background-color: #007bff; /* Bleu doux pour les actions principales */
  color: white;
}

.task-card .time-track-btn:hover,
.task-card .comment-btn:hover,
.task-card .dependency-btn:hover {
  background-color: #007bff;
  transform: scale(1.05);
}

/* Bouton "Stop" spécifique */
.task-card .time-stop-btn {
  background-color: #dc3545; /* Rouge pour les actions négatives */
}

.task-card .time-stop-btn:hover {
  background-color: #a71d2a;
}

/* Bouton "Terminer" spécifique */
.task-card .complete-btn {
  background-color:#f44336; /* Vert pour valider */
}

.task-card .complete-btn:hover {
  background-color: #1c7c34;
}

/* Modale */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #1a1a1a;
}

.modal-content label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #1a1a1a;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #1a1a1a;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.modal-actions .btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

/* Boutons de la modale */
.save-btn {
  background: #28a745; /* Vert pour Enregistrer */
  color: white;
}

.save-btn:hover {
  background: #1c7c34;
}

.cancel-btn {
  background: #dc3545; /* Rouge pour Annuler */
  color: white;
}

.cancel-btn:hover {
  background: #a71d2a;
}

/* Popups */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  width: 400px;
}

.popup-content h3 {
  margin-bottom: 10px;
}

.popup-content p {
  margin-bottom: 20px;
  font-size: 16px;
}

.close-popup-btn {
  background-color:#007bff; /* Bouton bleu */
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.close-popup-btn:hover {
  background-color: #003f8a;
}
</style>
