<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ReadAttendanceView",
  data() {
    return {
      srchVal: "",
      attendanceRecords: [
        {
          id: 1,
          name: "Turniken Louis",
          perc: 75
        },
        {
          id: 4,
          name: "Turniken Teodor",
          perc: 64
        },
        {
          id: 12,
          name: "Alois Jirásek",
          perc: 26
        },
      ]
    }
  },
  computed: {
    filteredRecords() {
      return this.attendanceRecords.filter(data => String(data.id).startsWith(this.srchVal))
    },
    filteredPassed() {
      return this.filteredRecords.filter(data => data.perc >= 70);
    }
  },
  methods: {
    goToChoose() {
      this.$router.push({ name: "read-attend-choose" })
    }
  }
});
</script>

<template>
  <div id="teacher-read-att">
    <div id="teacher-read-att-head">
      <p>Total attendance</p>
      <div id="teacher-read-att-head-overview">
        <p>Min. 70%</p>
        <p>Monday</p>
        <p>OSW2</p>
        <i>16:00 - 17:30</i>
        <i>20.9.2001 - 15.6.2002</i>
      </div>
    </div>
    <div id="teacher-read-att-srch" class="iconed-in">
      <i class="fa-solid fa-magnifying-glass in-ico"></i>
      <input v-model="srchVal" class="in" type="text" placeholder="Attendant name...">
    </div>
    <div id="teacher-read-att-list">
      <div v-for="rec in filteredRecords" :key="rec.id" class="teacher-read-att-list-item">
        <p class="teacher-read-att-list-item-name">{{ rec.id + " " + rec.name }}</p>
        <p class="teacher-read-att-list-item-perc">{{ rec.perc }}%</p>
        <i v-if="rec.perc >= 70" class="fa-regular fa-square-check" style="color: #90C418;"></i>
        <i v-else class="fa-regular fa-circle-xmark" style="color: #FC4850;"></i>
      </div>
    </div>
    <div id="teacher-read-att-summary">
      Passed {{ filteredPassed.length }} of {{ filteredRecords.length }} students
    </div>
    <div id="teacher-read-att-back">
      <button class="btn-2" @click="goToChoose">Back</button>
    </div>
  </div>
</template>

<style scoped>
#teacher-read-att {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  flex-grow: 1;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  padding: 8px;
  margin: 8px;
  border-radius: 8px;
  background-color: white;
}

#teacher-read-att-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

#teacher-read-att-head>p {}

#teacher-read-att-head-overview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

#teacher-read-att-head-overview>p {}

#teacher-read-att-head-overview>i {
  color: #757575;
}

#teacher-read-att-srch {}

#teacher-read-att-list {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 10px 0;
}

.teacher-read-att-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #ccc;
}

.teacher-read-att-list-item-name {}

.teacher-read-att-list-item-perc {}

.teacher-read-att-list-item>i {}

#teacher-read-att-summary {
  font-size: 14px;
  color: #757575;
}

#teacher-read-att-back {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-grow: 1;
}

#teacher-read-att-back>button {}
</style>