<script>
import { defineComponent } from "vue";
import ScheduleCalePad from "@/components/schedule/ScheduleCalePad.vue";
import ScheduleCaleChoose from "@/components/schedule/ScheduleCaleChoose.vue";
import ScheduleDay from "@/components/schedule/ScheduleDay.vue";

export default defineComponent({
  name: "ScheduleMonth",
  components: { ScheduleCalePad, ScheduleCaleChoose, ScheduleDay },
  props: {
    allClasses: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dateSelected: null,
      monthSelected: null,
      yearSelected: null,
    }
  },
  computed: {
    dateObjSelected() {
      const date = new Date();

      if (this.dateSelected !== null) date.setDate(this.dateSelected);
      date.setMonth(this.monthSelected);
      date.setFullYear(this.yearSelected);

      return date;
    },
    daySchedule() {
      return this.getDaySchedule(this.allClasses, this.dateObjSelected);
    }
  },
  methods: {
    setSelectedDate(date = new Date()) {
      if (this.dateSelected !== null) this.dateSelected = date.getDate();
      this.monthSelected = date.getMonth();
      this.yearSelected = date.getFullYear();
    },
    daysOfMonth(forDate = new Date()) {
      const DAY_MS = 24 * 60 * 60 * 1000;
      const forMonth = forDate.getMonth();
      const days = [];

      let dateObj = new Date(new Date(Number(forDate)).setDate(0));
      do {
        dateObj = new Date(Number(dateObj) + DAY_MS);
        if (dateObj.getMonth() === forMonth) days.push(dateObj);
      } while (dateObj.getMonth() === forMonth);

      return days;
    },
    prevDay() {
      if (this.dateSelected !== null)
        this.setSelectedDate(new Date(new Date(Number(this.dateObjSelected)).setDate(this.dateSelected - 1)));
      else this.setSelectedDate(new Date(new Date(Number(this.dateObjSelected)).setMonth(this.monthSelected - 1)));
    },
    nextDay() {
      if (this.dateSelected !== null)
        this.setSelectedDate(new Date(new Date(Number(this.dateObjSelected)).setDate(this.dateSelected + 1)));
      else this.setSelectedDate(new Date(new Date(Number(this.dateObjSelected)).setMonth(this.monthSelected + 1)));
    },
    chooseDate(date) {
      this.dateSelected = date;
    }
  },
  created() {
    this.setSelectedDate();
  }
});
</script>

<template>
  <div class="schedule-month">
    <div class="schedule-month-mode">
      <i @click="dateSelected = null" class="fa-regular fa-calendar-days" :class="{ active: !dateSelected }"></i>
      <i @click="dateSelected = 1" class="fa-solid fa-layer-group" :class="{ active: dateSelected }"></i>
    </div>
    <ScheduleCalePad :date="dateSelected" :month="monthSelected" :year="yearSelected" @prev="prevDay" @next="nextDay" />
    <div class="schedule-month-views">
      <ScheduleCaleChoose :daysOfMonth="daysOfMonth(dateObjSelected)" @choose-date="chooseDate" />
      <div v-show="dateSelected" class="schedule-month-day">
        <ScheduleDay orientation="V" :daySchedule="daySchedule" />
        <button @click="dateSelected = null" class="btn-2">Back</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.schedule-month {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 24px;
  flex-grow: 1;
}

.schedule-month-mode {
  display: flex;
  gap: 8px;
  width: 100%;
  color: #BDBDBD;
}

.schedule-month-mode>i {
  font-size: 24px;
  cursor: pointer;
}

.schedule-month-mode>i.active {
  color: #757575;
}

.schedule-month-views {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.schedule-month-day {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
