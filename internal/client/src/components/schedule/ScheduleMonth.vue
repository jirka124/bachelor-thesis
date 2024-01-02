<script>
import { defineComponent } from "vue";
import ScheduleCalePad from "@/components/schedule/ScheduleCalePad.vue";
import ScheduleCaleChoose from "@/components/schedule/ScheduleCaleChoose.vue";
import ScheduleDay from "@/components/schedule/ScheduleDay.vue";

export default defineComponent({
  name: "ScheduleMonth",
  components: { ScheduleCalePad, ScheduleCaleChoose, ScheduleDay },
  data() {
    return {
      choosenDay: null,
    }
  }
});
</script>

<template>
  <div class="schedule-month">
    <div class="schedule-month-mode">
      <i @click="choosenDay = null" class="fa-regular fa-calendar-days" :class="{ active: !choosenDay }"></i>
      <i @click="choosenDay = 1" class="fa-solid fa-layer-group" :class="{ active: choosenDay }"></i>
    </div>
    <ScheduleCalePad />
    <div class="schedule-month-views">
      <ScheduleCaleChoose />
      <div v-show="choosenDay" class="schedule-month-day">
        <ScheduleDay orientation="V" />
        <button @click="choosenDay = null" class="btn-2">Back</button>
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
