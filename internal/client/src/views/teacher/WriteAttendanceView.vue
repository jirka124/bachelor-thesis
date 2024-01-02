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
      attendants: []
    }
  },
  mounted() {
    for (let i = 0; i < 150; i++) {
      this.attendants.push({ id: i, name: "Anolli Bozyni" })
    }
  }
});
</script>

<template>
  <div id="teacher-write-att">
    <div id="teacher-write-att-head">
      <ScheduleCalePad />
      <div id="teacher-write-att-head-class">
        <i class="fa-solid fa-person-running"></i>
        <p>OSW2</p>
        <p>16:00 - 17:30</p>
      </div>
    </div>
    <div id="teacher-write-att-filter" class="iconed-in">
      <i class="fa-solid fa-magnifying-glass in-ico"></i>
      <input class="in" type="text" placeholder="Attendant name...">
    </div>
    <div id="teacher-write-att-list" class="scroll">
      <div v-for="attendant in attendants" :key="attendant.id" class="teacher-write-att-item">
        <CCheckbox v-model:checked="checked" />
        <p>{{ attendant.id }} {{ attendant.name }}</p>
      </div>
      <div class="teacher-write-att-item">
        <CCheckbox v-model:checked="checked" />
        <p>2 Alois Jirásek</p>
      </div>
    </div>
    <div id="teacher-write-att-act">
      <div id="teacher-write-att-act-all">
        <CCheckbox v-model:checked="checked" />
        <div>Select all</div>
      </div>
      <button class="btn-1">Save</button>
      <button class="btn-2">Back</button>
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