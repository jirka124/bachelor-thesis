<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleCaleChoose",
});
</script>

<template>
  <div class="schedule-cale-choose">
    <div class="schedule-cale-choose-tbl">
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Mon</div>
        <div class="schedule-cale-choose-col-date"></div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Tues</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Wed</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Thurs</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Fri</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">31</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Sat</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
      </div>
      <div class="schedule-cale-choose-col">
        <div class="schedule-cale-choose-col-day">Sun</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
        <div class="schedule-cale-choose-col-date">x</div>
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
