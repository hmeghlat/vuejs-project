<script setup>
import { RouterView } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

</script>

<template>
  <!-- Applique la classe en fonction de la route -->
  <div :class="[
      $route.name === 'dashboard'
        ? 'dashboard-page'
        : $route.name === 'tasks'
        ? 'task-page'
        : $route.name === 'projects'
        ? 'project-page'
        : 'login-page'
    ]">
    <RouterView />
  </div>
</template>

<style>
/* Styles généraux pour l'application, sans couleur de fond */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* Style spécifique à la page de login */
.login-page {
  background-color: #f5f5f5; /* Fond de la page de connexion */
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* Style spécifique à la page de dashboard */
.dashboard-page {
  background-color: #FF4B2B; /* Fond orange pour le dashboard */
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* Style spécifique à la page de tâches */
.task-page {
  background-color: #f0f8ff; /* Fond bleu clair pour les tâches */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto; /* Ajoute un défilement vertical si nécessaire */
  box-sizing: border-box;
}

/* Style spécifique à la page de projets */
.project-page {
  background-color: #f9f9f9; /* Fond gris clair pour les projets */
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto; /* Ajoute un défilement vertical si nécessaire */
  box-sizing: border-box;
}
</style>
