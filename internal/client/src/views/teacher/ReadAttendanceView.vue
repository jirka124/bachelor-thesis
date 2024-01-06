<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";

export default defineComponent({
  name: "ReadAttendanceView",
  data() {
    return {
      srchVal: "",
    }
  },
  computed: {
    ...mapStores(useTeacherStore),
    minAtt() {
      return this.teacherStore.readClass.minAtt ? this.teacherStore.readClass.minAtt : 0;
    },
    minPercentTxt() {
      return this.minAtt ? this.minAtt : "NONE";
    },
    dayNameTxt() {
      return this.teacherStore.readClass.day ? this.resolveDayByInd(this.teacherStore.readClass.day) : "NONE";
    },
    subjectNameTxt() {
      return this.teacherStore.readClass.subject ? this.teacherStore.readClass.subject : "NONE";
    },
    timeInfoTxt() {
      const readClass = this.teacherStore.readClass
      return readClass.tBy && readClass.tTill ? `${readClass.tBy.slice(0, 5)} - ${readClass.tTill.slice(0, 5)}` : "NONE - NONE";
    },
    dateInfoTxt() {
      const readClass = this.teacherStore.readClass
      return readClass.cBy && readClass.cTill ? `${new Date(readClass.cBy).toLocaleDateString()} - ${new Date(readClass.cTill).toLocaleDateString()}` : "NONE - NONE";
    },
    allClassRecurrs() {
      const dateNow = new Date();
      return this.getClassRepetitions(this.teacherStore.readClass).filter(rep => rep.date < dateNow);
    },
    attendanceRecords() {
      const classesCount = this.allClassRecurrs.length;
      const maxRecurrId = this.allClassRecurrs.reduce((max, r) => {
        if (r.recurrId > max) return r.recurrId;
        return max;
      }, 1);

      return this.teacherStore.readClassAttends.map(a => {
        const aa = this.deepCopy(a);

        aa.presenceCount = this.teacherStore.readClassAttendsPresent.reduce((total, p) => {
          if (a.id === p.attendantId && p.recurrId <= maxRecurrId) ++total;
          return total;
        }, 0);

        aa.percExact = aa.presenceCount / classesCount * 100;
        aa.perc = Number.parseFloat(aa.percExact).toFixed(2);

        console.log(aa);
        return aa;
      });
    },
    filteredRecords() {
      return this.attendanceRecords.filter(data => String(data.id).startsWith(this.srchVal))
    },
    filteredPassed() {
      return this.filteredRecords.filter(data => data.percExact >= this.minAtt);
    }
  },
  methods: {
    goToChoose() {
      this.$router.push({ name: "read-attend-choose" })
    },
    resolveDayByInd(ind) {
      const days = ["Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"];
      return days[ind] || "";
    },
    async fetchClass() {
      // fetch information about class, its attendants and their presence
      let r;
      try {
        const classId = parseInt(this.$route.params.classId) || null;
        if (classId === null) return;

        r = (await this.$api.post("teacher/view-read-attend-csr", { classId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("classObj"))
          this.teacherStore.setReadClass(r.result.classObj);
        if (r.result.hasOwnProperty("attendants"))
          this.teacherStore.setReadClassAttends(r.result.attendants);
        if (r.result.hasOwnProperty("presence"))
          this.teacherStore.setReadClassAttendsPresent(r.result.presence);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchClass();
  }
});
</script>

<template>
  <div id="teacher-read-att">
    <div id="teacher-read-att-head">
      <p>Total attendance</p>
      <div id="teacher-read-att-head-overview">
        <p>Min. {{ minPercentTxt }}%</p>
        <p>{{ dayNameTxt }}</p>
        <p>{{ subjectNameTxt }}</p>
        <i>{{ timeInfoTxt }}</i>
        <i>{{ dateInfoTxt }}</i>
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
        <i v-if="rec.percExact >= minAtt" class="fa-regular fa-square-check" style="color: #90C418;"></i>
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