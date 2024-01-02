<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleClass",
});
</script>

<template>
  <div class="schedule-class">
    <p class="schedule-class-short">OSW2</p>
    <p class="schedule-class-inter">16:00 - 17:30</p>
  </div>
</template>

<style scoped>
.schedule-class {
  text-align: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 200px;
  padding: 20px 8px;
  border-radius: 8px;
  color: white;
  background-color: #0097A7;
  cursor: pointer;
}

.schedule-class:nth-of-type(even) {
  background-color: #00BCD4;
}

.schedule-class-short {}

.schedule-class-inter {}
</style>
