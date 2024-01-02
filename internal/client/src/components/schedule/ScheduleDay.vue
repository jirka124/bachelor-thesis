<script>
import { defineComponent } from "vue";
import ScheduleClass from "@/components/schedule/ScheduleClass.vue";

export default defineComponent({
  name: "ScheduleDay",
  components: { ScheduleClass },
  props: {
    orientation: {
      type: String,
      default: "H",
    }
  }
});
</script>

<template>
  <div class="schedule-day scroll" :class="{ horiz: orientation !== 'V', verti: orientation === 'V' }">
    <ScheduleClass v-for="i in [1, 2, 3, 4, 5]" :key="i" />
  </div>
</template>

<style scoped>
.schedule-day {
  display: flex;
  gap: 32px 16px;
  padding: 8px 0;
}

.schedule-day.horiz {
  overflow-x: auto;
}

.schedule-day.verti {
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
}
</style>
