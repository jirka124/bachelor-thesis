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
    },
    daySchedule: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    sortedDaySchedule() {
      const MIN_S = 60;
      const HOUR_S = 60 * 60;

      return this.daySchedule.toSorted((a, b) => {
        const aa = a.tBy.split(":");
        const bb = b.tBy.split(":");
        const aSecs = aa[0] * HOUR_S + aa[1] * MIN_S;
        const bSecs = bb[0] * HOUR_S + bb[1] * MIN_S;

        if (aSecs < bSecs) return -1;
        else if (bSecs > aSecs) return 1;
        return 0;
      })
    }
  }
});
</script>

<template>
  <div class="schedule-day scroll" :class="{ horiz: orientation !== 'V', verti: orientation === 'V' }">
    <ScheduleClass v-for="classObj in sortedDaySchedule" :key="classObj.id" :classObj="classObj" />
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
