<template>
  <div :class="['dashboard', { 'sidebar-open': isSidebarOpen }]">
    <!-- Passer l'état et écouter l'événement -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    <!-- Contenu principal -->
    <div class="main-content">
      <div class="horizontal-container">
        <div class="task-list">
          <TaskList class="dashboard-item" />
        </div>
        <div class="project-list">
          <ProjectList class="dashboard-item" />
        </div>
        <div class="notification-list">
          <NotificationList class="dashboard-item" />
        </div>
        <div class="agenda">
          <Schedule class="dashboard-item" />
        </div>
        
      </div>
    </div>
    
  </div>
  
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import TaskList from "../components/TaskList.vue";
import Schedule from "../components/Schedule.vue";
import ProjectList from "../components/ProjectList.vue";
import NotificationList from "../components/notification.vue";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
    TaskList,
    Schedule,
    ProjectList,
    NotificationList,
  },
  data() {
    return {
      user: {
        username: "",
        role: "",
      },
      isSidebarOpen: false, // État de la sidebar
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.user = user;
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
};
</script>

<style scoped>
/* Layout principal */
.dashboard {
  display: flex;
  flex-direction: column; /* Permet un meilleur contrôle du contenu */
  height: 100vh; /* Définit une hauteur de vue complète */
  overflow-y: auto; /* Active le défilement vertical si nécessaire */
  overflow-x: hidden; /* Évite un défilement horizontal inutile */
  background-color: #f9fafb; /* Couleur de fond */
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background: linear-gradient(135deg, #ff6a00, #ff2d55);
  color: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transform: translateX(-100%); /* Cachée par défaut */
  transition: transform 0.3s ease; /* Transition pour l'ouverture */
}

.sidebar-open .sidebar {
  transform: translateX(0); /* Visible lorsqu'elle est ouverte */
}

/* Main content */
.main-content {
  margin-left: 0; /* Défaut sans sidebar */
  padding: 20px;
  display: flex;
  flex-grow: 1;
  overflow: auto; /* Ajoute le défilement si nécessaire */
  overflow-x: auto;
  transition: margin-left 0.3s ease; /* Animation pour le déplacement */
}

.sidebar-open .main-content {
  margin-left: 250px; /* Décalage égal à la largeur de la sidebar */
}

/* Conteneur horizontal pour les composants */
.horizontal-container {
  display: flex;
  justify-content: space-between; /* Espace entre les composants */
  align-items: flex-start; /* Aligne les éléments en haut */
  gap: 20px; /* Espacement entre les éléments */
  flex-wrap: nowrap; /* Empêche les composants de s'empiler */
  width: 100%;
  overflow-x: auto; /* Active le défilement horizontal si nécessaire */
}

/* Composants individuels */
.dashboard-item {
  flex: 1; /* Chaque composant prend un espace égal */
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-width: 300px; /* Taille minimale pour les composants */
}

.task-list,
.project-list,
.notification-list,
.agenda {
  flex: 1; /* Assure une distribution égale des composants */
}

/* Responsiveness pour les petits écrans */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column; /* Les composants s'empilent sur de petits écrans */
  }
  .sidebar-open .main-content {
    margin-left: 0; /* Désactive le glissement sur les petits écrans */
  }
}
</style>
