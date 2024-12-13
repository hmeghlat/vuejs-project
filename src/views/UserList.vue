<template>
    <div :class="['user-page', { 'sidebar-open': isSidebarOpen }]">
        <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
    <div class="user-list-page">
      <h1>Liste des Utilisateurs</h1>
      <div v-if="loading" class="loading-message">Chargement...</div>
      <div v-else-if="users.length === 0" class="empty-message">
        <p>Aucun utilisateur trouvé.</p>
      </div>
      <div v-else class="user-cards">
        <div v-for="user in users" :key="user.username" class="user-card">
          <p><strong>Nom d'utilisateur :</strong> {{ user.username }}</p>
          <p><strong>Rôle :</strong> {{ user.role }}</p>
        </div>
      </div>
    </div>
</div>

  </template>
  
  <script>
  import axios from "axios";
  import Sidebar from "../components/Sidebar.vue";
  export default {
    name: "UserList",
    components: { Sidebar },
    data() {
      return {
        users: [],
        loading: true,
        isSidebarOpen: false,
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
        toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
        },

       async fetchUsers() {
            try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser || !storedUser.username) {
                alert("Utilisateur non connecté !");
                this.$router.push("/login");
                return;
            }
            const payload = { username: storedUser.username, display_type: "users" };
            const response = await axios.post("http://127.0.0.1:5000/project/display", payload);
    
            if (response.status === 200 && Array.isArray(response.data.users)) {
                this.users = response.data.users;
            } else {
                console.error("Erreur lors de la récupération des utilisateurs :", response.data);
                this.users = [];
            }
            } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
            this.users = [];
            } finally {
            this.loading = false;
            }
        },
    },
  };
  </script>
  
  <style scoped>
/* Conteneur principal */
.user-list-page {
  padding: 40px;
  background-color: #f7f9fc;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

/* Titre principal */
h1 {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-transform: uppercase;
}

/* Message de chargement */
.loading-message,
.empty-message {
  text-align: center;
  font-size: 18px;
  color: #718096;
  background: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
}

/* Liste des cartes utilisateurs */
.user-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* Carte utilisateur */
.user-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Texte des cartes */
.user-card p {
  margin: 5px 0;
  font-size: 16px;
  color: #4a5568;
}

.user-card p strong {
  color: #2c5282;
}

/* Responsive Design */
@media (max-width: 768px) {
  .user-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  h1 {
    font-size: 24px;
  }
}
</style>
