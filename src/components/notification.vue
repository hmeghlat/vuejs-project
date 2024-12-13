<template>
    <div class="notification-page">
      <h1>Notifications</h1>
      <div v-if="notifications.length === 0" class="empty-notifications">
        Aucune notification disponible.
      </div>
      <ul v-else class="notification-list">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          :class="{ unread: !notification.is_read }"
        >
          <p>{{ notification.message }}</p>
          <small>Reçue le : {{ formatDate(notification.created_at) }}</small>
          <button
            v-if="!notification.is_read"
            @click="markAsRead(notification.id)"
            class="mark-read-btn"
          >
            Marquer comme lu
          </button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "Notification",
    data() {
      return {
        notifications: [],
        user: {
          username: "", // Chargé depuis le localStorage
        },
      };
    },
    created() {
      this.loadUser();
      this.fetchNotifications();
    },
    methods: {
      loadUser() {
        try {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          if (storedUser && storedUser.username) {
            this.user.username = storedUser.username;
          } else {
            alert("Utilisateur non connecté !");
            this.$router.push("/login");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          this.$router.push("/login");
        }
      },
      async fetchNotifications() {
        try {
          const response = await axios.post("http://127.0.0.1:5000/auth/notifications", {
            username: this.user.username,
          });
          if (response.status === 200 && Array.isArray(response.data.notifications)) {
            this.notifications = response.data.notifications;
          } else {
            console.error("Erreur lors de la récupération des notifications :", response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des notifications :", error);
        }
      },
      async markAsRead(notificationId) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/auth/notifications/read",
            {
              notification_id: notificationId,
            }
          );
          if (response.status === 200) {
            this.notifications = this.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, is_read: true }
                : notification
            );
          } else {
            console.error("Erreur lors de la mise à jour de la notification :", response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la notification :", error);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return "Date invalide";
        return date.toLocaleString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  };
  </script>
 
 <style scoped>
/* Conteneur principal */
.notification-page {
  padding: 40px;
  background-color: #f7f9fc; /* Fond doux */
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

/* Titre */
.notification-page h1 {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  text-transform: uppercase;
}

/* Message vide */
.empty-notifications {
  text-align: center;
  font-style: italic;
  font-size: 16px;
  color: #718096;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Liste des notifications */
.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-list li {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 20px 60px; /* Espace supplémentaire en bas pour le bouton */
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative; /* Pour positionner le bouton */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.notification-list li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Notifications non lues */
.notification-list li.unread {
  background: #fff8dc;
  font-weight: bold;
}

/* Texte de la notification */
.notification-list p {
  margin: 0 0 10px;
  font-size: 16px;
  color: #4a5568;
  line-height: 1.5;
}

/* Date */
.notification-list small {
  font-size: 14px;
  color: #718096;
  display: block;
}

/* Bouton "Marquer comme lu" */
.mark-read-btn {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  position: absolute; /* Position fixe en bas de la carte */
  right: 20px;
  bottom: 20px; /* Alignement en bas à droite */
  font-size: 14px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.mark-read-btn:hover {
  background: #0f5bbf;
  transform: scale(1.05);
}
</style>
