<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "ReadAttendanceChooseView",
  components: { TableComp },
  computed: {
    ...mapStores(useTeacherStore),
    tableConfig() {
      return {
        control: [
          {
            name: "id",
            displayName: "ID"
          },
          {
            name: "subject",
            displayName: "Subject"
          },
          {
            name: "day",
            displayName: "Day"
          },
          {
            name: "tBy",
            displayName: "Time - by"
          },
          {
            name: "tTill",
            displayName: "Time - till"
          },
          {
            name: "recurrence",
            displayName: "Recurrence"
          },
          {
            name: "cBy",
            displayName: "Continuance - by"
          },
          {
            name: "cTill",
            displayName: "Continuance - till"
          },
          {
            name: "minAtt",
            displayName: "Min. attendance"
          },
          {
            name: "act1",
            type: "button",
            displayName: ""
          }
        ],
        data: this.teacherStore.allTeacherClasses.map(c => {
          const cc = this.deepCopy(c);
          cc.tBy = `${cc.tBy.split(":")[0]}:${cc.tBy.split(":")[1]}`;
          cc.tTill = `${cc.tTill.split(":")[0]}:${cc.tTill.split(":")[1]}`;
          cc.cBy = new Date(cc.cBy).toLocaleDateString();
          cc.cTill = new Date(cc.cTill).toLocaleDateString();
          cc.day = this.resolveDayByInd(cc.day);
          cc.recurrence = this.resolveRecurrByKey(cc.recurrence);

          cc.act1 = {
            ico: "fa-solid fa-eye",
            event: "view-class",
            eventParams: { id: cc.id }
          };

          return cc;
        })
      }
    }
  },
  methods: {
    viewClass({ id }) {
      this.$router.push({ name: "read-attend", params: { classId: id } })
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
    resolveRecurrByKey(key) {
      const recurrs = {
        once: "Once",
        e1week: "Every week",
        e2week: "Every 2 week",
        e3week: "Every 3 week"
      }
      return recurrs[key] || "";
    },
    async fetchClasses() {
      // fetch list of classes that belongs to logged teacher
      let r;
      try {
        r = (await this.$api.post("teacher/view-read-attend-choose-csr")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("classes"))
          this.teacherStore.setAllTeacherClasses(r.result.classes);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchClasses();
  },
});
</script>

<template>
  <div id="teacher-read-att-choose">
    <TableComp :config="tableConfig" @view-class="viewClass" />
  </div>
</template>

<style scoped>
#teacher-read-att-choose {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 8px;
}
</style>