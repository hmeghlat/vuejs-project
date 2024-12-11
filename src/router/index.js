import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // Chemin d'accès vers Login
import Dashboard from '../views/Dashbord.vue';
import Project from '../views/Project.vue';
import Task from '@/views/Task.vue';

const routes = [
  {
    path: '/',
    redirect: '/login', // Redirige la racine vers la page de connexion
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  {
    path: '/projects', 
    name: 'Project',
    component: Project,
  },

  
  {
    path: '/task', 
    name: 'Task',
    component: Task,
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
