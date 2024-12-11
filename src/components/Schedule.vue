<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="month-navigation">
        <button @click="previousMonth" class="btn-nav">
          <i class="fa fa-arrow-left"></i>
        </button>
        <span class="month-title">{{ currentMonthName }} {{ currentYear }}</span>
        <button @click="nextMonth" class="btn-nav">
          <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
    <div class="calendar-body">
      <div class="day-names">
        <span v-for="day in daysOfWeek" :key="day">{{ day }}</span>
      </div>
      <div class="dates">
        <!-- Affichage des jours du mois -->
        <button
        v-for="(day, index) in days"
        :key="index"
        :class="['date', { faded: day.isFaded, 'current-day': day.isToday }]"
      >
        {{ day.number }}
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Schedule",
  data() {
    const today = new Date();
    return {
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth(), // Index 0 (janvier) à 11 (décembre)
      daysOfWeek: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
    };
  },
  computed: {
    currentMonthName() {
      return this.months[this.currentMonth];
    },
    days() {
      const days = [];
      const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
      const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
      const daysInMonth = lastDayOfMonth.getDate();

      // Nombre de jours du mois précédent à afficher
      const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Ajuste pour que lundi soit le premier
      const previousMonthDays = new Date(
        this.currentYear,
        this.currentMonth,
        0
      ).getDate();

      // Ajouter les jours du mois précédent (faded)
      for (let i = startWeekday; i > 0; i--) {
        days.push({
          number: previousMonthDays - i + 1,
          isFaded: true,
        });
      }

      // Ajouter les jours du mois en cours
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({
          number: i,
          isFaded: false,
          isToday:
            i === new Date().getDate() &&
            this.currentMonth === new Date().getMonth() &&
            this.currentYear === new Date().getFullYear(),
        });
      }

      // Ajouter les jours du mois suivant (faded)
      const remainingDays = 7 - (days.length % 7);
      for (let i = 1; i <= remainingDays && remainingDays < 7; i++) {
        days.push({
          number: i,
          isFaded: true,
        });
      }

      return days;
    },
  },
  methods: {
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
  },
};
</script>

<style scoped>
/* Identique à la version précédente */
.calendar {
  background: linear-gradient(135deg, #fff, #f5f7fa);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  width: 250px; /* Taille réduite */
  font-family: "Arial", sans-serif;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px; /* Espace réduit */
}

.month-navigation {
  display: flex;
  align-items: center;
}

.btn-nav {
  background: transparent;
  border: none;
  color: #2c3e50;
  font-size: 1rem;
  margin: 0 5px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-nav:hover {
  color: #ff6a00;
}

.month-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.calendar-body {
  display: flex;
  flex-direction: column;
}

.day-names {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  color: #606060;
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.date {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  padding: 8px;
  font-size: 0.8rem;
  color: #2c3e50;
  transition: all 0.3s ease;
}

.date:hover {
  background-color: #ff6a00;
  color: #fff;
}

.current-day {
  background-color: #ff6a00;
  color: #fff;
}

.faded {
  color: #bbb;
}
</style>
