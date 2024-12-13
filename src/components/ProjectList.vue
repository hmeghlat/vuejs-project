<template>
    <div class="project-container">
      <!-- Vérification si des projets sont disponibles -->
      <div v-if="projects.length === 0" class="text-center text-gray-600">
        Aucun projet à afficher.
      </div>
  
      <!-- Affichage des projets -->
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="project-card flex items-start gap-4 bg-white rounded-lg shadow p-4 hover:shadow-lg transition duration-300"
      >
        <!-- Icône -->
        <div class="icon-container flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        </div>
  
        <!-- Détails du projet -->
        <div class="details">
          <h3 class="text-blue-700 font-semibold text-lg">{{ project.name }}</h3>
          <p class="text-sm text-gray-600 mb-2">{{ project.description }}</p>
          <p class="text-sm">
            <strong>Début :</strong> {{ project.start_date }}
          </p>
          <p class="text-sm">
            <strong>Fin :</strong> {{ project.end_date }}
          </p>
          
          <p class="text-sm">
            <strong>État :</strong>
            <span
              :class="{
                'text-green-600': project.state === 'en cours',
                'text-red-600': project.state === 'terminé',
                'text-yellow-600': project.state === 'en attente',
              }"
            >
              {{ project.state }}
            </span>
          </p>
          <!-- Rapport de temps -->
        <div v-if="project.timeReport" class="time-report mt-2">
          <p class="text-sm">
            <strong>Temps Total :</strong> {{ project.timeReport.total_time_minutes }} minutes
          </p>
          <ul class="text-sm">
            <strong>Détails :</strong>
            <li v-for="(entry, index) in project.timeReport.time_entries" :key="index">
              {{ entry.username }} : {{ entry.duration_minutes }} minutes
            </li>
          </ul>
        </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { EventBus } from "../utils/eventBus";
  
  export default {
    name: "ProjectList",
    data() {
      return {
        projects: [], // Liste des projets reçus depuis le backend
        username: "", // Nom d'utilisateur de l'utilisateur connecté
      };
    },
    created() {
      // Récupérer le nom d'utilisateur au moment de l'initialisation
      this.loadUser();
      // Charger les projets
      this.fetchProjects();
    },
    methods: {
      // Charger l'utilisateur connecté à partir de localStorage ou d'une autre source
      loadUser() {
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser && storedUser.username) {
            this.username = storedUser.username;
            console.log("Utilisateur connecté :", this.username);
          } else {
            console.error("Utilisateur non trouvé dans le localStorage");
            // Rediriger vers la page de connexion si nécessaire
            this.$router.push("/login");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          this.$router.push("/login");
        }
      },
  
      // Récupérer la liste des projets pour l'utilisateur connecté
      async fetchProjects() {
        try {
          const payload = {
            username: this.username, // Nom d'utilisateur de l'utilisateur connecté
            display_type: "projects", // Toujours "projects"
          };
  
          console.log("Envoi de la requête avec payload :", payload);
  
          const response = await axios.post(
            "http://127.0.0.1:5000/project/display",
            payload
          );
  
          console.log("Réponse du backend :", response.data);
  
          // Vérifier si le backend retourne un tableau de projets
          if (response.data && Array.isArray(response.data.projects)) {
          this.projects = await Promise.all(
            response.data.projects.map(async (project) => {
              const timeReport = await this.fetchTimeReport(project.name);
              return {
                ...project,
                timeReport,
              };
            })
          );
                
            
            const projectNames = this.projects.map((project) => project.name);
            EventBus.emit("projectsUpdated", projectNames);
          } else {
            console.error("Format inattendu de la réponse :", response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des projets :", error);
        }
      },

      // Récupérer le rapport de temps d'un projet
    async fetchTimeReport(projectName) {
      try {
        const payload = {
          username: this.username,
          project_name: projectName,
        };
        const response = await axios.post("http://127.0.0.1:5000/project/report/time", payload);
        return response.data;
      } catch (error) {
        console.error(`Erreur lors de la récupération du rapport de temps pour ${projectName} :`, error);
        return null;
      }
    },
  

    },
  };

  
  </script>
  
  <style scoped>
/* Conteneur principal */
.project-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f7f9fc; /* Couleur de fond douce et moderne */
  height: 100vh;
  overflow-y: auto;
  font-family: 'Roboto', sans-serif;
}

/* Message aucun projet */
.text-center {
  font-size: 18px;
  color: #718096;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Carte de projet */
.project-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Icône */
.icon-container {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebf8ff;
  border-radius: 50%;
}

.icon-container svg {
  width: 32px;
  height: 32px;
  color: #3182ce;
}

/* Détails */
.details {
  flex-grow: 1;
}

.details h3 {
  font-size: 20px;
  font-weight: bold;
  color: #2c5282;
  margin-bottom: 10px;
}

.details p {
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 8px;
}

.details p strong {
  font-weight: 600;
  color: #2d3748;
}

/* État du projet */
.text-green-600 {
  color: #38a169; /* En cours */
}

.text-red-600 {
  color: #e53e3e; /* Terminé */
}

.text-yellow-600 {
  color: #d69e2e; /* En attente */
}

/* Rapport de temps */
.time-report {
  margin-top: 15px;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
}

.time-report p {
  font-size: 14px;
  color: #2d3748;
  margin-bottom: 5px;
}

.time-report ul {
  padding-left: 20px;
}

.time-report ul li {
  font-size: 14px;
  color: #4a5568;
}

/* Responsive */
@media (max-width: 768px) {
  .project-card {
    flex-direction: column;
  }

  .icon-container {
    margin-bottom: 15px;
  }
}
</style>
