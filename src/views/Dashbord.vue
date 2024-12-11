<template>
  <div :class="['dashboard', { 'sidebar-open': isSidebarOpen }]">
    <!-- Passer l'état et écouter l'événement -->
    <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    <div class="main-content">
      <div class="task-list">
        <TaskList />
      </div>
      <div class="project-list">
        <ProjectList />
      </div>

    </div>
    <div class="agenda">
          <Schedule />
        </div>
  </div>
</template>

<script>
import Sidebar from "../components/Sidebar.vue";
import TaskList from "../components/TaskList.vue";
import Schedule from "../components/Schedule.vue";
import ProjectList from "../components/ProjectList.vue";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
    TaskList,
    Schedule,
    ProjectList,
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
  height: 100vh;
  overflow: hidden;
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
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap; /* Permet de s'adapter sur plusieurs lignes si nécessaire */
  margin-left: 0;
  padding: 20px;
  gap: 20px;
  transition: margin-left 0.3s ease; /* Transition pour le déplacement */
}

.sidebar-open .main-content {
  margin-left: 250px; /* Décalage égal à la largeur de la sidebar */
}

/* Task List */
.task-list {
  flex: 2; /* Priorité plus grande pour occuper de l'espace */
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Agenda */
.agenda {
  flex: 1; /* Taille plus petite pour occuper moins d'espace */
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative; /* Assure que l'agenda reste bien placé */
  z-index: 5; /* Priorité basse pour qu'il n'interfère pas avec la sidebar */
}

/* Project List */
.project-list {
  flex: 2;
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* Responsiveness pour les petits écrans */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column; /* S'empile sur de petits écrans */
  }
  .sidebar-open .main-content {
    margin-left: 0; /* Désactive le glissement sur les petits écrans */
  }
}
</style>
