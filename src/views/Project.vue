<template>
    <div :class="['projects-page', { 'sidebar-open': isSidebarOpen }]">
      <!-- Barre latérale -->
      <Sidebar :isOpen="isSidebarOpen" @toggle="toggleSidebar" />
  
      <!-- Contenu principal -->
      <div class="main-content">
        <header class="projects-header">
          <h1>Gestion des Projets</h1>
          <!-- Bouton Ajouter (visible uniquement pour les administrateurs et chefs d'équipe) -->
          <button
            v-if="hasPermission('create')"
            @click="showCreateProjectModal = true"
            class="add-project-btn"
          >
            + Ajouter un Projet
          </button>
        </header>
  
        <section class="projects-list">
          <div v-if="projects.length === 0" class="empty-message">
            <i class="fas fa-folder-open"></i> Aucun projet disponible.
          </div>
          <div v-else class="project-cards">
            <div v-for="project in projects" :key="project.id" class="project-card">
              <div class="project-header">
                <h2>{{ project.name }}</h2>
                <span
                  class="project-state"
                  :class="project.state === 'terminé' ? 'completed' : 'ongoing'"
                >
                  {{ project.state }}
                </span>
              </div>
              <p>{{ project.description }}</p>
              <p><strong>Début :</strong> {{ project.start_date }}</p>
              <p><strong>Fin :</strong> {{ project.end_date }}</p>
              <p><strong>Membres :</strong> {{ project.members.join(', ') }}</p>
              <div class="actions">
                <!-- Bouton Modifier (visible uniquement pour administrateurs et chefs d'équipe) -->
                <button
                    v-if="hasPermission('edit')"
                    @click="updateProjectState(project.name)"
                    class="btn edit-btn"
                    >
                    Modifier
                    </button>

                
                <!-- Bouton Supprimer (visible uniquement pour administrateurs et chefs d'équipe) -->
                <button
                  v-if="hasPermission('delete')"
                  @click="deleteProject(project.id)"
                  class="btn delete-btn"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </section>
  
        <!-- Modal pour ajouter/modifier un projet -->
        <div v-if="showCreateProjectModal" class="modal">
          <div class="modal-content">
            <h3>{{ isEditing ? 'Modifier le Projet' : 'Créer un Nouveau Projet' }}</h3>
            <form @submit.prevent="saveProject">
              <label>
                Nom du Projet :
                <input type="text" v-model="currentProject.name" required />
              </label>
              <label>
                Description :
                <textarea v-model="currentProject.description" required></textarea>
              </label>
              <label>
                Date de Début :
                <input type="date" v-model="currentProject.start_date" required />
              </label>
              <label>
                Date de Fin :
                <input type="date" v-model="currentProject.end_date" required />
              </label>
              <label>
                Membres :
                <input
                  type="text"
                  v-model="membersInput"
                  placeholder="Séparez les membres par des virgules"
                />
              </label>
              <label>
                État :
                <select v-model="currentProject.state" required>
                  <option value="en cours">En cours</option>
                  <option value="terminé">Terminé</option>
                </select>
              </label>
              <div class="modal-actions">
                <button type="submit" class="btn save-btn">Enregistrer</button>
                <button type="button" @click="closeModal" class="btn cancel-btn">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import Sidebar from "../components/Sidebar.vue";
  import axios from "axios";
  export default {
    components: { Sidebar },
    data() {
      return {
        user: {
          username: "",
          role: "", // Le rôle de l'utilisateur : "utilisateur", "chef d'équipe", ou "administrateur"
        },
        isSidebarOpen: false,
        projects: [],
        showCreateProjectModal: false,
        isEditing: false,
        currentProject: {
          id: null,
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          members: [],
          state: "en cours",
        },
        membersInput: "",
        projectCounter: 1,
      };
    },
    created() {
       // Récupérer le nom d'utilisateur au moment de l'initialisation
       this.loadUser();
      // Charger les projets
      this.fetchProjects();
    },
    methods: {
      toggleSidebar() {
        this.isSidebarOpen = !this.isSidebarOpen;
      },
      // Charger l'utilisateur connecté à partir de localStorage ou d'une autre source
      loadUser() {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (storedUser && storedUser.username && storedUser.role) {
            this.user.username = storedUser.username;
            this.user.role = storedUser.role;
            console.log("Utilisateur connecté :", this.user.username, "Rôle :", this.user.role);
            } else {
            console.error("Utilisateur ou rôle non trouvé dans le localStorage");
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
                username: this.user.username, // Utilisez le bon chemin
                display_type: "projects",
                };

                console.log("Envoi de la requête avec payload :", payload);

                const response = await axios.post(
                "http://127.0.0.1:5000/project/display",
                payload
                );

                if (response.status === 200 && response.data && Array.isArray(response.data.projects)) {
                    this.projects = response.data.projects.map((project) => ({
                    ...project,
                    members: project.members || [], // Définit un tableau vide si `members` est manquant
                    
                }));
                
                } else {
                console.error("Réponse inattendue du serveur :", response.data);
                alert("Erreur : Impossible de récupérer les projets.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des projets :", error);
                alert("Impossible de se connecter au serveur. Vérifiez l'URL ou le backend.");
            }
            },

      hasPermission(action) {
        const permissions = {
            utilisateur: [], // Aucun accès aux fonctionnalités de gestion
            "chef d'equipe": ["create", "edit", "delete"], // Accès complet
            administrateur: ["create", "edit", "delete"], // Accès complet
        };
        return permissions[this.user.role]?.includes(action) || false;
        },

        async saveProject() {
            if (!this.hasPermission(this.isEditing ? "edit" : "create")) {
                alert("Vous n'avez pas la permission pour cette action.");
                return;
            }
            // Reste du code pour la sauvegarde (inchangé)
            this.currentProject.members = this.membersInput.split(",").map((m) => m.trim());
            const payload = {
                username: this.user.username,
                name: this.currentProject.name,
                description: this.currentProject.description,
                start_date: this.currentProject.start_date,
                end_date: this.currentProject.end_date,
                members: this.currentProject.members,
                state: this.currentProject.state,
            };

            try {
                const response = await fetch("http://127.0.0.1:5000/project/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                });
                const result = await response.json();
                if (response.ok) {
                alert("Projet créé avec succès !");
                this.closeModal();
                await this.fetchProjects();
                } else {
                alert(result.message || "Erreur lors de la sauvegarde du projet.");
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                alert("Impossible de se connecter au serveur.");
            }
            },


    async updateProjectState(projectName) {
        if (!this.hasPermission("edit")) {
            alert("Vous n'avez pas la permission de modifier l'état d'un projet.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:5000/project/update_state", {
                username: this.user.username,
                project_name: projectName,
            });

            if (response.status === 200) {
                alert(response.data.message || "État du projet mis à jour avec succès !");
                this.fetchProjects(); // Rafraîchit la liste des projets
            } else {
                console.error("Erreur lors de la mise à jour de l'état du projet :", response.data);
                alert(response.data.message || "Une erreur s'est produite lors de la mise à jour.");
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            alert("Impossible de se connecter au serveur.");
        }
    },



      deleteProject(projectId) {
        if (this.hasPermission("delete")) {
          this.projects = this.projects.filter((p) => p.id !== projectId);
        } else {
          alert("Vous n'avez pas la permission de supprimer ce projet.");
        }
      },
      closeModal() {
        this.showCreateProjectModal = false;
        this.isEditing = false;
        this.currentProject = {
          id: null,
          name: "",
          description: "",
          start_date: "",
          end_date: "",
          members: [],
          state: "en cours",
        };
        this.membersInput = "";
        
      },
    },
    mounted() {
      this.fetchProjects();
    },
  };
  </script>
  
  
  <style scoped>
  .projects-page {
    display: flex;
    background-color: #f9fafb;
    min-height: 100vh;
  }
  
  .sidebar-open .main-content {
    margin-left: 250px;
    transition: margin-left 0.3s ease;
  }
  
  .main-content {
    flex-grow: 1;
    padding: 30px;
  }
  
  .projects-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .add-project-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .add-project-btn:hover {
    background: #0056b3;
  }
  
  .project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .project-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.3s ease;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .project-state {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 12px;
    text-transform: uppercase;
  }
  
  .project-state.completed {
    background: #4caf50;
    color: white;
  }
  
  .project-state.ongoing {
    background: #ffc107;
    color: white;
  }
  
  .actions {
    margin-top: 15px;
  }
  
  .actions .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .actions .edit-btn {
    background: #007bff;
    color: white;
  }
  
  .actions .edit-btn:hover {
    background: #0056b3;
  }
  
  .actions .delete-btn {
    background: #f44336;
    color: white;
  }
  
  .actions .delete-btn:hover {
    background: #d32f2f;
  }
  
  .empty-message {
    text-align: center;
    font-size: 18px;
    color: #666;
    margin-top: 20px;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  }
  
  .modal-actions .btn {
    width: 48%;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .save-btn {
    background: #4caf50;
    color: white;
  }
  
  .save-btn:hover {
    background: #388e3c;
  }
  
  .cancel-btn {
    background: #f44336;
    color: white;
  }
  
  .cancel-btn:hover {
    background: #d32f2f;
  }
  </style>
  