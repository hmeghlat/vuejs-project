<template>
  <aside id="nav-bar" :class="{ open: isOpen }">
    <div id="nav-toggle-container">
      <button id="nav-toggle-button" @click="handleToggle" aria-label="Toggle navigation">
        <i :class="['fas', isOpen ? 'fa-times' : 'fa-bars']"></i>
      </button>
    </div>
    <div id="nav-header" v-if="isOpen">
      <a id="nav-title" href="#">ProManage</a>
      <hr />
    </div>
    <div id="nav-content" v-if="isOpen">
      <router-link to="/dashboard" class="nav-button-link">
        <div class="nav-button">
          <i class="fas fa-clipboard-list"></i><span>Tableau de bord</span>
        </div>
      </router-link>
      <router-link to="/projects" class="nav-button-link">
        <div class="nav-button">
          <i class="fas fa-clipboard-list"></i><span>Projets</span>
        </div>
      </router-link>
      <router-link to="/task" class="nav-button-link">
      <div class="nav-button">
        <i class="fas fa-tasks"></i><span>Taches</span>
      </div>
      </router-link>
      <router-link to="/users" class="nav-button-link">
      <div class="nav-button">
        <i class="fas fa-tasks"></i><span>Liste des Utilisateurs</span>
      </div>
    </router-link>
    <div v-if="user.role === 'administrateur'" class="admin-actions">
        <button @click="goToRoleManagement" class="btn-role-btn">
          Gérer les Rôles
        </button>
      </div>

      
    </div>
    <div id="nav-footer" v-if="isOpen">
      <div id="nav-footer-heading">
        <div id="nav-footer-titlebox">
          <a id="nav-footer-title" href="#" target="_blank">{{ user.username }}</a>
          <span id="nav-footer-subtitle">{{ user.role }}</span>
        </div>
      </div>
    </div>
  </aside>
</template>

 <script>
  export default {
  name: "Sidebar",
  props: {
    isOpen: { // Déclarez ici les props attendues
      type: Boolean,
      required: true, // Facultatif, selon vos besoins
    },
  },
  data() {
    return {
      user: {
        username: "John Doe",  // Par défaut ou récupéré de localStorage
        role: "Admin",         // Par défaut ou récupéré de localStorage
       
      },
    };
  },
  created() {
    // Récupérer les données de l'utilisateur si elles existent dans le localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.user = user;
    }
  },
  methods: {
    handleToggle() {
      this.$emit("toggle"); // Émet un événement vers le parent
    },

    goToRoleManagement() {
      this.$router.push("/role-management");
    },
  },
};

  </script>
 
 <style scoped>
 /* Conteneur principal */
 #nav-bar {
   width: 0;
   background: linear-gradient(to bottom, #FF4B2B, #FF416C); /* Conserve le dégradé rouge actuel */
   height: 100vh;
   padding: 20px 30px;
   position: fixed;
   top: 0;
   left: 0;
   transition: width 0.3s ease;
   z-index: 1000;
   overflow: hidden;
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Ombre douce */
 }
 
 #nav-bar.open {
   width: 250px; /* Largeur de la sidebar ouverte */
 }
 
 /* Bouton de bascule */
 #nav-toggle-container {
   position: absolute;
   top: 15px;
   left: 15px;
   z-index: 2000;
 }
 
 #nav-toggle-button {
   background: none;
   border: none;
   color: #FFFFFF;
   font-size: 30px;
   cursor: pointer;
   transition: transform 0.3s ease, opacity 0.3s ease;
 }
 
 #nav-toggle-button:hover {
   transform: scale(1.1); /* Mise en avant au survol */
   opacity: 0.8; /* Légère transparence */
 }
 
 /* En-tête */
 #nav-header {
   display: flex;
   flex-direction: row; /* Aligner horizontalement le bouton et le titre */
   align-items: center; /* Alignement vertical centré */
   padding: 15px 0;
   margin-bottom: 20px;
   gap: 15px; /* Espacement entre le bouton et le titre */
 }
 
 #nav-title {
   font-size: 24px;
   font-weight: bold;
   color: #FFFFFF;
   text-transform: uppercase;
   letter-spacing: 1px;
   text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3); /* Ombre subtile */
   transition: transform 0.3s ease, opacity 0.3s ease;
   white-space: nowrap; /* Évite que le titre se coupe sur plusieurs lignes */
 }
 
 #nav-title:hover {
   transform: scale(1.1);
   opacity: 0.9;
 }
 
 /* Contenu */
 #nav-content {
   margin-top: 20px;
 }
 
 .nav-button-link {
   text-decoration: none;
 }
 
 .nav-button {
   display: flex;
   align-items: center;
   padding: 12px 15px;
   margin-bottom: 15px;
   border-radius: 8px;
   background-color: rgba(255, 255, 255, 0.1); /* Fond semi-transparent */
   transition: background-color 0.3s ease, transform 0.2s ease;
 }
 
 .nav-button:hover {
   background-color: rgba(255, 255, 255, 0.3); /* Fond plus lumineux au survol */
   transform: translateX(5px); /* Déplacement subtil à droite */
 }
 
 .nav-button i {
   font-size: 18px;
   color: #FFFFFF;
   margin-right: 10px;
 }
 
 .nav-button span {
   font-size: 16px;
   font-weight: bold;
   color: #FFFFFF;
 }
 
 /* Footer */
 #nav-footer {
   margin-top: 30px;
   border-top: 1px solid rgba(255, 255, 255, 0.2);
   padding-top: 15px;
 }
 
 #nav-footer-titlebox {
   display: flex;
   flex-direction: column;
   justify-content: center;
 }
 
 #nav-footer-title {
   font-weight: bold;
   color: #FFFFFF;
   font-size: 16px;
 }
 
 #nav-footer-subtitle {
   font-size: 14px;
   color: #FFDFDF; /* Couleur légèrement plus claire */
 }
 
 /* Bouton pour administrateur */
 .btn-role-btn {
   background: #ff9800;
   color: white;
   padding: 10px 15px;
   border-radius: 8px;
   font-size: 14px;
   cursor: pointer;
   margin-top: 15px;
   transition: background 0.3s ease, transform 0.2s ease;
   display: block;
   width: 100%;
   text-align: center;
   border: none;
 }
 
 .btn-role-btn:hover {
   background: #e68900;
   transform: scale(1.05);
 }
 
 /* Responsive */
 @media (max-width: 768px) {
   #nav-bar {
     width: 100%;
     height: auto;
     padding: 10px 20px;
   }
 
   #nav-title {
     font-size: 20px;
     text-align: center;
     margin: 0 auto;
   }
 
   .nav-button {
     justify-content: center;
   }
 
   .nav-button span {
     display: none; /* Masquer les textes pour les petits écrans */
   }
 
   .btn-role-btn {
     font-size: 12px;
     padding: 8px;
   }
 }
 </style>
 