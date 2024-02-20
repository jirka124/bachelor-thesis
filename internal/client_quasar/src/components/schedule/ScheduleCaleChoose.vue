<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleCaleChoose",
  props: {
    daysOfMonth: {
      type: Array,
      default() { return [] }
    }
  },
  computed: {
    datesByDayArr() {
      let offset = 0;
      if (this.daysOfMonth.length > 0) {
        const firstDay = this.daysOfMonth[0].getDay();
        offset = firstDay - 1; // 1 (Monday index)
        if (offset < 0) offset = 6;
      }

      const dateArr = [
        ["Mon"],
        ["Tues"],
        ["Wed"],
        ["Thurs"],
        ["Fri"],
        ["Sat"],
        ["Sun"],
      ];

      for (let i = 0; i < offset; i++) {
        dateArr[i].push({
          isReplacement: true,
          forDate: -offset + i
        });
      }

      this.daysOfMonth.map(date => {
        let dateArrInd = date.getDay() - 1;
        if (dateArrInd < 0) dateArrInd = dateArr.length - 1;
        dateArr[dateArrInd].push(date);
      })

      return dateArr;
    }
  },
  methods: {
    getKey(date, day) {
      if (date.isReplacement) return `${day[0]}_${date.forDate}`;
      return typeof date === "string" ? `${date}_head` : `${day[0]}_${date.getDate()}`;
    },
    getClass(i) {
      return `schedule-cale-choose-col-${i === 0 ? "day" : "date"}`;
    },
    getContent(date) {
      if (date.isReplacement) return "";
      return typeof date === "string" ? date : date.getDate();
    },
    onClick(date) {
      if (date.isReplacement || typeof date === "string") return;
      this.$emit("choose-date", date.getDate());
    }
  }
});
</script>

<template>
  <div class="schedule-cale-choose">
    <div class="schedule-cale-choose-tbl">
      <div v-for="day in datesByDayArr" :key="day[0]" class="schedule-cale-choose-col">
        <div v-for="(date, i) in day" :key="getKey(date, day[0])" :class="getClass(i)" @click="onClick(date)">{{
          getContent(date) }}</div>
      </div>
    </div>
    <p class="schedule-cale-choose-notice">Find a day in past to write attandance for</p>
  </div>
</template>

<style scoped>
.schedule-cale-choose {
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  flex-grow: 1;
}

.schedule-cale-choose-tbl {
  display: flex;
  column-gap: 8px;
  min-width: 300px;
  max-width: 600px;
}

.schedule-cale-choose-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  flex-grow: 1;
  min-width: 32px;
}

.schedule-cale-choose-col-day {
  min-width: 28px;
  padding: 2px 6px;
  border-radius: 8px;
  color: white;
  background-color: #0097A7;
}

.schedule-cale-choose-col-date {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
}

.schedule-cale-choose-col-date:hover {
  background-color: #ccc;
}

.schedule-cale-choose-notice {
  color: #757575;
}

@media only screen and (max-width: 512px) {
  .schedule-cale-choose-tbl {
    min-width: auto;
    max-width: none;
    width: 100%;
  }
}
</style>
