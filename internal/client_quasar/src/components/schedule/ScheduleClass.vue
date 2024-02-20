<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleClass",
  props: {
    classObj: {
      type: Object,
      default: null
    }
  },
  methods: {
    goTo() {
      if (this.classObj === null) return;
      this.$router.push({ name: "write-attend", params: { classId: this.classObj.id }, query: { recurrId: this.classObj.recurrId } })
    }
  }
});
</script>

<template>
  <div class="schedule-class" @click="goTo()">
    <p class="schedule-class-short">{{ classObj !== null ? classObj.subject : "NONE" }}</p>
    <p class="schedule-class-inter">{{ classObj !== null ? classObj.tBy.slice(0, 5) : "NONE" }} - {{ classObj !== null ?
      classObj.tTill.slice(0, 5) : "NONE" }}</p>
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
