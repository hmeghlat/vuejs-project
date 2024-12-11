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
        avatar: "https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547",  // Par défaut ou récupéré de localStorage
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
  },
};

  </script>
  
  <style scoped>
  #nav-bar {
  width: 0;
  background: linear-gradient(to bottom, #FF4B2B, #FF416C); /* Dégradé cohérent avec la page login */
  height: 100vh;
  padding: 40px;
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s ease;
  z-index: 1000;
  overflow: hidden;
}

#nav-bar.open {
  width: 300px; /* Augmenter la largeur de la sidebar */
}

#nav-toggle-container {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2000;
}

#nav-toggle-button {
  background: none;
  border: none;
  color: #FFFFFF; /* Blanc pour s'harmoniser avec le dégradé */
  font-size: 30px;
  cursor: pointer;
}

#nav-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

#nav-title {
  font-size: 24px; /* Augmenter la taille */
  font-weight: bold;
  color: #FFFFFF; /* Couleur blanche */
  text-transform: uppercase;
  text-align: right; /* Aligner vers la droite */
  margin-left: auto; /* Déplacer vers la droite */
  margin-right: 20px; /* Espacement à droite */
  letter-spacing: 2px; /* Espacement des lettres pour un effet élégant */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); /* Ajouter une ombre pour du relief */
  transition: transform 0.3s ease, color 0.3s ease; /* Transition pour l'effet hover */
}

#nav-title:hover {
  transform: scale(1.1); /* Légère mise en avant au survol */
  color: #FFDFDF; /* Couleur plus claire au survol */
}

#nav-content {
  margin-top: 20px;
}

.nav-button {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  gap: 10px; 
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Couleur semi-transparente au hover */
}

.nav-button i {
  font-size: 20px;
  color: #FFFFFF; /* Icônes en blanc */
}

.nav-button span {
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF; /* Texte blanc pour correspondre au design */
}

#nav-footer {
  margin-top: 30px;
}

#nav-footer-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


#nav-footer-titlebox {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#nav-footer-title {
  font-weight: bold;
  color: #FFFFFF; /* Nom d'utilisateur en blanc */
  font-size: 14px;
}

#nav-footer-subtitle {
  font-size: 12px;
  color: #FFDFDF; /* Sous-titre légèrement plus clair */
}

hr {
  border: 1px solid rgba(255, 255, 255, 0.3); /* Ligne de séparation semi-transparente */
  margin-top: 20px;
  margin-bottom: 20px;
}

/* Styles pour un design responsive */
@media (max-width: 768px) {
  #nav-bar {
    width: 100%;
  }
}

</style>
  