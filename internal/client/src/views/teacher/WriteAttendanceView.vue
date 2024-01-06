<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import ScheduleCalePad from "@/components/schedule/ScheduleCalePad.vue";
import CCheckbox from "@/components/CCheckbox.vue";

export default defineComponent({
  name: "WriteAttendanceView",
  components: { ScheduleCalePad, CCheckbox },
  data() {
    return {
      srchVal: ""
    }
  },
  computed: {
    ...mapStores(useTeacherStore),
    attendants() {
      return this.teacherStore.writenClassAttends.map(a => {
        const aa = this.deepCopy(a);

        aa.presence = this.teacherStore.writenClassAttendsPresent.find(p => a.id === p.attendantId) || null;

        return aa;
      });
    },
    filteredAttendants() {
      return this.attendants.filter(att => String(att.id).startsWith(this.srchVal));
    },
    checkedInFiltered() {
      return this.filteredAttendants.filter(att => att.presence);
    },
    noneFilteredChecked() {
      return this.checkedInFiltered.length === 0;
    },
    allFilteredChecked() {
      return this.filteredAttendants.length === this.checkedInFiltered.length
    },
    allClassRecurrs() {
      return this.getClassRepetitions(this.teacherStore.writenClass);
    },
    writedRecurrObj() {
      const recurrId = parseInt(this.$route.query.recurrId) || null;
      return this.allClassRecurrs.find(r => r.recurrId === recurrId) || null;
    },
    date() {
      return this.writedRecurrObj ? this.writedRecurrObj.date.getDate() : new Date().getDate();
    },
    month() {
      return this.writedRecurrObj ? this.writedRecurrObj.date.getMonth() : new Date().getMonth();
    },
    year() {
      return this.writedRecurrObj ? this.writedRecurrObj.date.getFullYear() : new Date().getFullYear();
    }
  },
  methods: {
    goTo() {
      this.$router.push({ name: "schedule" })
    },
    toggleOne(attendantId) {
      const att = this.filteredAttendants.find(a => a.id === attendantId);
      if (att.presence) this.deletePresence([attendantId]);
      else this.createPresence([attendantId]);
    },
    toggleAll() {
      let toCreate = [];
      let toDelete = [];

      if (this.noneFilteredChecked) toCreate = this.filteredAttendants.map(att => att.id);
      else toDelete = this.filteredAttendants.map(att => att.id);

      if (toCreate.length > 0) this.createPresence(toCreate);
      else if (toDelete.length > 0) this.deletePresence(toDelete);
    },
    async fetchClass() {
      // fetch information about class, its attendants and their presence for current recurrence
      let r;
      try {
        const classId = parseInt(this.$route.params.classId) || null;
        const recurrId = parseInt(this.$route.query.recurrId) || null;
        if (classId === null || recurrId === null) return;

        r = (await this.$api.post("teacher/view-write-attend-csr", { classId, recurrId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("classObj"))
          this.teacherStore.setWritenClass(r.result.classObj);
        if (r.result.hasOwnProperty("attendants"))
          this.teacherStore.setWritenClassAttends(r.result.attendants);
        if (r.result.hasOwnProperty("presence"))
          this.teacherStore.setWritenClassAttendsPresent(r.result.presence);
      } catch (error) {
        console.error(error);
      }
    },
    async deletePresence(attendants) {
      // deletes selected presence/presences from the selected class and recurrsion
      let r;
      try {
        const classId = parseInt(this.$route.params.classId) || null;
        const recurrId = parseInt(this.$route.query.recurrId) || null;
        if (classId === null || recurrId === null) return;

        r = (await this.$api.post("teacher/delete-presence", { classId, recurrId, attendants })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("oldPresences"))
          this.teacherStore.delWritenClassAttendsPresent(r.result.oldPresences);
      } catch (error) {
        console.error(error);
      }
    },
    async createPresence(attendants) {
      // creates selected presence/presences to the selected class and recurrsion
      let r;
      try {
        const classId = parseInt(this.$route.params.classId) || null;
        const recurrId = parseInt(this.$route.query.recurrId) || null;
        if (classId === null || recurrId === null) return;

        r = (await this.$api.post("teacher/create-presence", { classId, recurrId, attendants })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("newPresences"))
          this.teacherStore.addWritenClassAttendsPresent(r.result.newPresences);
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchClass();
  }
});
</script>

<template>
  <div id="teacher-write-att">
    <div id="teacher-write-att-head">
      <ScheduleCalePad :readonly="true" :date="date" :month="month" :year="year" />
      <div id="teacher-write-att-head-class">
        <i class="fa-solid fa-person-running"></i>
        <p>{{ writedRecurrObj ? writedRecurrObj.subject : "NONE" }}</p>
        <p>{{ writedRecurrObj ? writedRecurrObj.tBy.slice(0, 5) : "NONE" }} - {{ writedRecurrObj ?
          writedRecurrObj.tTill.slice(0, 5) : "NONE" }}</p>
      </div>
    </div>
    <div id="teacher-write-att-filter" class="iconed-in">
      <i class="fa-solid fa-magnifying-glass in-ico"></i>
      <input v-model="srchVal" class="in" type="text" placeholder="">
    </div>
    <div id="teacher-write-att-list" class="scroll">
      <div v-for="attendant in filteredAttendants" :key="attendant.id" class="teacher-write-att-item">
        <CCheckbox :checked="attendant.presence" @click="toggleOne(attendant.id)" />
        <p>{{ attendant.id }} {{ attendant.name }}</p>
      </div>
    </div>
    <div id="teacher-write-att-act">
      <div id="teacher-write-att-act-all">
        <CCheckbox :checked="allFilteredChecked" @click="toggleAll" />
        <div>{{ noneFilteredChecked ? "Select all" : "Unselect all" }}</div>
      </div>
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