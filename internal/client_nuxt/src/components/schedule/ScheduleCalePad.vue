<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleCalePad",
  emits: ["prev", "next"],
  props: {
    date: {
      type: Number,
      default: null
    },
    month: {
      type: Number,
      default: null
    },
    year: {
      type: Number,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }
  }
});
</script>

<template>
  <div class="schedule-cale-pad">
    <i v-if="!readonly" @click="$emit('prev')" class="fa-solid fa-caret-left"></i>
    <div class="schedule-cale-pad-date">
      <div class="schedule-cale-pad-day">{{ date !== null ? date : "" }}</div>
      <div class="schedule-cale-pad-month">{{ month !== null ? months[month] : "" }}</div>
      <div class="schedule-cale-pad-year">{{ year !== null ? year : "" }}</div>
    </div>
    <i v-if="!readonly" @click="$emit('next')" class="fa-solid fa-caret-right"></i>
  </div>
</template>

<style scoped>
.schedule-cale-pad {
  display: inline-flex;
  align-items: center;
  column-gap: 8px;
  padding: 6px;
  border-radius: 16px;
  background-color: #00BCD4;
}

.schedule-cale-pad>i {
  padding: 0 6px;
  cursor: pointer;
}

.schedule-cale-pad>i:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.schedule-cale-pad-date {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 6px;
}

.schedule-cale-pad-month {
  color: white;
}
</style>
