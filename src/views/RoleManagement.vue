<template>
<div :class="['role-page', { 'sidebar-open': isSidebarOpen }]">
  <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
  <div class="role-management">
    <h1>Gestion des Rôles</h1>
    <div class="role-form">
      <form @submit.prevent="changeUserRole">
        <label>
          Nom d'utilisateur cible :
          <input v-model="targetUsername" type="text" required placeholder="Nom d'utilisateur" />
        </label>
        <label>
          Nouveau rôle :
          <select v-model="newRole" required>
            <option value="utilisateur">utilisateur</option>
            <option value="chef d'équipe">chef d'équipe</option>
          </select>
        </label>
        <button type="submit" class="btn">Changer le Rôle</button>
      </form>
      <div v-if="message" :class="{'success': isSuccess, 'error': !isSuccess}">{{ message }}</div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
export default {
  name: "RoleManagement",
  components: { Sidebar },
  data() {
    return {
      targetUsername: "",
      newRole: "utilisateur",
      message: "",
      isSuccess: false,
      adminUsername: "", // Récupéré depuis localStorage
      isSidebarOpen: false,
    };
  },
  created() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "administrateur") {
      this.adminUsername = user.username;
    } else {
      alert("Accès refusé : vous devez être administrateur.");
      this.$router.push("/dashboard");
    }
  },
  methods: {

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    async changeUserRole() {
      try {
        const payload = {
          admin_username: this.adminUsername,
          target_username: this.targetUsername,
          new_role: this.newRole,
        };
        
        const response = await axios.post("http://127.0.0.1:5000/user/change_role", payload);
        if (response.status === 200) {
          this.isSuccess = true;
          this.message = response.data.message || "Rôle modifié avec succès.";
        }
      } catch (error) {
        console.error("Erreur lors de la modification du rôle :", error);
        this.isSuccess = false;
        this.message =
          error.response?.data?.error ||
          "Une erreur est survenue. Veuillez réessayer.";
      }
    },
  },
};
</script>

<style scoped>
/* Conteneur principal */
.role-management {
  background-color: #f7f9fc; /* Fond doux */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  max-width: 600px;
  margin: 40px auto;
}

/* Titre principal */
.role-management h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;
  letter-spacing: 1px;
}

/* Formulaire de gestion des rôles */
.role-form {
  margin-top: 20px;
}

.role-form label {
  display: block;
  font-size: 16px;
  color: #4a5568;
  margin-bottom: 10px;
}

.role-form input,
.role-form select {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #4a5568;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.role-form input:focus,
.role-form select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
  outline: none;
}

/* Bouton */
.btn {
  display: inline-block;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  background-color: #3182ce;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
}

.btn:hover {
  background-color: #2b6cb0;
  transform: translateY(-2px);
}

/* Message de succès ou d'erreur */
.message {
  margin-top: 15px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-radius: 8px;
}

.success {
  background-color: #e6fffa;
  color: #2c7a7b;
  border: 1px solid #81e6d9;
}

.error {
  background-color: #ffe6e6;
  color: #c53030;
  border: 1px solid #fc8181;
}

/* Responsive */
@media (max-width: 768px) {
  .role-management {
    padding: 30px;
  }

  .role-management h1 {
    font-size: 24px;
  }

  .btn {
    font-size: 14px;
  }
}
</style>
