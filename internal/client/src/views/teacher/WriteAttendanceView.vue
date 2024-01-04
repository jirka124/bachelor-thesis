<script>
import { defineComponent } from "vue";
import ScheduleCalePad from "@/components/schedule/ScheduleCalePad.vue";
import CCheckbox from "@/components/CCheckbox.vue";

export default defineComponent({
  name: "WriteAttendanceView",
  components: { ScheduleCalePad, CCheckbox },
  data() {
    return {
      checked: true,
      srchVal: "",
      date: new Date().getDate(),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      attendants: []
    }
  },
  computed: {
    filteredAttendants() {
      return this.attendants.filter(att => String(att.id).startsWith(this.srchVal));
    },
    checkedInFiltered() {
      return this.filteredAttendants.filter(att => att.checked);
    },
    noneFilteredChecked() {
      return this.checkedInFiltered.length === 0;
    },
    allFilteredChecked() {
      return this.filteredAttendants.length === this.checkedInFiltered.length
    }
  },
  methods: {
    goTo() {
      this.$router.push({ name: "schedule" })
    },
    toggleAll() {
      if (this.noneFilteredChecked) this.filteredAttendants.map(att => att.checked = true)
      else this.filteredAttendants.map(att => att.checked = false)
    }
  },
  mounted() {
    for (let i = 0; i < 12; i++) {
      this.attendants.push({ id: i, name: "Anolli Bozyni", checked: false })
    }
  }
});
</script>

<template>
  <div id="teacher-write-att">
    <div id="teacher-write-att-head">
      <ScheduleCalePad :readonly="true" :date="date" :month="month" :year="year" />
      <div id="teacher-write-att-head-class">
        <i class="fa-solid fa-person-running"></i>
        <p>OSW2</p>
        <p>16:00 - 17:30</p>
      </div>
    </div>
    <div id="teacher-write-att-filter" class="iconed-in">
      <i class="fa-solid fa-magnifying-glass in-ico"></i>
      <input v-model="srchVal" class="in" type="text" placeholder="">
    </div>
    <div id="teacher-write-att-list" class="scroll">
      <div v-for="attendant in filteredAttendants" :key="attendant.id" class="teacher-write-att-item">
        <CCheckbox v-model:checked="attendant.checked" />
        <p>{{ attendant.id }} {{ attendant.name }}</p>
      </div>
    </div>
    <div id="teacher-write-att-act">
      <div id="teacher-write-att-act-all">
        <CCheckbox :checked="allFilteredChecked" @click="toggleAll" />
        <div>{{ noneFilteredChecked ? "Select all" : "Unselect all" }}</div>
      </div>
      <button class="btn-1">Save</button>
      <button class="btn-2" @click="goTo">Back</button>
    </div>
  </div>
</template>

<style scoped>
#teacher-write-att {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  flex-grow: 1;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  border-radius: 8px;
  padding: 8px;
  background-color: white;
  margin: 8px;
}

#teacher-write-att-head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
}

#teacher-write-att-head-class {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}

#teacher-write-att-head-class>i {
  font-size: 24px;
}

#teacher-write-att-head-class>p:nth-of-type(1) {}

#teacher-write-att-head-class>p:nth-of-type(2) {
  color: #757575;
}

#teacher-write-att-filter {}

#teacher-write-att-list {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.teacher-write-att-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
}

#teacher-write-att-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

#teacher-write-att-act-all {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

@media only screen and (max-width: 512px) {
  #teacher-write-att-head {
    justify-content: center;
  }
}
</style>