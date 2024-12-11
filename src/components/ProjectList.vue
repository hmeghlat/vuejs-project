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
            <strong>Membres :</strong> {{ project.members.join(", ") }}
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
           
            this.projects = response.data.projects.map((project) => ({
                    ...project,
                    members: project.members || [], // Définit un tableau vide si `members` est manquant
                    
                }));
                
            
            const projectNames = this.projects.map((project) => project.name);
            EventBus.emit("projectsUpdated", projectNames);
          } else {
            console.error("Format inattendu de la réponse :", response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des projets :", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .project-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100vh; 
    overflow-y: auto;
  }
  
  .project-card {
    display: flex;
    align-items: flex-start;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }
  
  .project-card:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-3px);
  }
  
  .icon-container {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .details {
    flex-grow: 1;
  }
  
  .details h3 {
    margin: 0;
    font-size: 1.25rem;
  }
  
  .details p {
    margin: 0.25rem 0;
    font-size: 0.875rem;
    color: #4a5568;
  }
  
  .text-green-600 {
    color: #10b981;
  }
  
  .text-red-600 {
    color: #ef4444;
  }
  
  .text-yellow-600 {
    color: #f59e0b;
  }
  
  .text-center {
    text-align: center;
  }
  </style>
  