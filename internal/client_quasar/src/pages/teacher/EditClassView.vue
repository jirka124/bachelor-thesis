<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import FieldInput from "@/components/FieldInput.vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "EditClassView",
  components: { FieldInput, TableComp },
  data() {
    return {
      saveLock: false,
      deleteLock: false,
      FIELDS: [
        {
          name: "id",
          displayName: "ID",
          type: "text",
          ico: "fa-solid fa-database",
          isDisabled: true
        },
        {
          name: "subject",
          displayName: "Subject",
          type: "text",
          ico: "fa-solid fa-database",
        },
        {
          name: "day",
          displayName: "Day",
          type: "select",
          ico: "fa-solid fa-database",
          options: [
            {
              name: "monday",
              displayName: "Monday"
            },
            {
              name: "tuesday",
              displayName: "Tuesday"
            },
            {
              name: "wednesday",
              displayName: "Wednesday"
            },
            {
              name: "thursday",
              displayName: "Thursday"
            },
            {
              name: "friday",
              displayName: "Friday"
            },
            {
              name: "saturday",
              displayName: "Saturday"
            },
            {
              name: "sunday",
              displayName: "Sunday"
            },
          ]
        },
        {
          name: "tBy",
          displayName: "Time - by",
          type: "time",
          ico: "fa-solid fa-database",
        },
        {
          name: "tTill",
          displayName: "Time - till",
          type: "time",
          ico: "fa-solid fa-database",
        },
        {
          name: "recurrence",
          displayName: "Recurrence",
          type: "select",
          ico: "fa-solid fa-database",
          options: [
            {
              name: "once",
              displayName: "Once"
            },
            {
              name: "e1week",
              displayName: "Every week"
            },
            {
              name: "e2week",
              displayName: "Every 2 week"
            },
            {
              name: "e3week",
              displayName: "Every 3 week"
            },
          ]
        },
        {
          name: "cBy",
          displayName: "Continuance - by",
          type: "date",
          ico: "fa-solid fa-database",
        },
        {
          name: "cTill",
          displayName: "Continuance - till",
          type: "date",
          ico: "fa-solid fa-database",
        },
        {
          name: "minAtt",
          displayName: "Min. attendance %",
          type: "number",
          ico: "fa-solid fa-database",
        },
      ],
      values: {
        id: "NONE",
        subject: "",
        day: "monday",
        tBy: this.splitDateTime(this.localAsUTC())[1].slice(0, 5),
        tTill: this.splitDateTime(this.localAsUTC())[1].slice(0, 5),
        recurrence: "once",
        cBy: this.splitDateTime(this.localAsUTC())[0],
        cTill: this.splitDateTime(this.localAsUTC())[0],
        minAtt: 70,
      }
    }
  },
  computed: {
    ...mapStores(useTeacherStore),
    tableConfig() {
      return {
        allowNew: true,
        control: [
          {
            name: "id",
            displayName: "ID"
          },
          {
            name: "name",
            displayName: "Name"
          },
          {
            name: "act1",
            type: "button",
            displayName: ""
          }
        ],
        data: this.teacherStore.editedClassAttends.map(a => {
          const aa = this.deepCopy(a);

          aa.act1 = {
            ico: "fa-solid fa-pen",
            event: "edit-attend",
            eventParams: { id: aa.id }
          };

          return aa;
        })
      }
    }
  },
  methods: {
    goToChoose() {
      this.$router.push({ name: "edit-class-choose" });
    },
    createNew() {
      const classId = parseInt(this.$route.params.classId) || null;
      this.$router.push({ name: "create-att", query: { classId } })
    },
    editAttend({ id }) {
      const classId = parseInt(this.$route.params.classId) || null;
      this.$router.push({ name: "edit-att", params: { attendId: id }, query: { classId } });
    },
    splitDateTime(dateStr) {
      return dateStr.slice(0, -1).split("T")
    },
    resolveDayByInd(ind) {
      const days = ["monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"];
      return days[ind] || "";
    },
    async fetchClass() {
      // fetch current fields of class and its attendants
      let r;
      try {
        const classId = parseInt(this.$route.params.classId) || null;
        if (classId === null) return;

        r = (await this.$api.post("teacher/view-edit-class-csr", { classId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("classObj"))
          this.teacherStore.setEditedClass(r.result.classObj);
        if (r.result.hasOwnProperty("attendants"))
          this.teacherStore.setEditedClassAttends(r.result.attendants);

        this.values.id = this.teacherStore.editedClass.id || "NONE";
        this.values.subject = this.teacherStore.editedClass.subject || "";
        this.values.day = this.resolveDayByInd(this.teacherStore.editedClass.day) || "monday";
        this.values.tBy = this.teacherStore.editedClass.tBy.slice(0, 5) || this.splitDateTime(this.localAsUTC())[1].slice(0, 5);
        this.values.tTill = this.teacherStore.editedClass.tTill.slice(0, 5) || this.splitDateTime(this.localAsUTC())[1].slice(0, 5);
        this.values.recurrence = this.teacherStore.editedClass.recurrence || "once";
        this.values.cBy = this.splitDateTime(this.teacherStore.editedClass.cBy)[0] || this.splitDateTime(this.localAsUTC())[0];
        this.values.cTill = this.splitDateTime(this.teacherStore.editedClass.cTill)[0] || this.splitDateTime(this.localAsUTC())[0];
        this.values.minAtt = this.teacherStore.editedClass.minAtt || 70;
      } catch (error) {
        console.error(error);
      }
    },
    async saveClass() {
      if (this.saveLock) return;
      this.saveLock = true;

      let r;
      try {
        r = (await this.$api.post("teacher/save-class", { ...this.values })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToChoose();
      } catch (error) {
        console.error(error);
      }
      this.saveLock = false;
    },
    async deleteClass() {
      if (this.deleteLock) return;
      this.deleteLock = true;

      const classId = parseInt(this.$route.params.classId) || null;
      let r;
      try {
        r = (await this.$api.post("teacher/delete-class", { classId })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToChoose();
      } catch (error) {
        console.error(error);
      }
      this.deleteLock = false;
    }
  },
  mounted() {
    this.fetchClass();
  },
});
</script>

<template>
  <div id="teacher-edit-cls">
    <div id="teacher-edit-cls-attrs">
      <FieldInput v-for="field in FIELDS" :key="field.name" :field="field" v-model:value="values[field.name]" />
      <div id="teacher-edit-cls-attrs-act">
        <button class="btn-1" @click="saveClass">Save</button>
        <button class="btn-2" @click="deleteClass">Delete</button>
        <button class="btn-3" @click="goToChoose">Cancel</button>
      </div>
    </div>
    <div id="teacher-edit-cls-attends">
      <p>Manage attendents</p>
      <TableComp :config="tableConfig" @create-new="createNew" @edit-attend="editAttend" />
    </div>
  </div>
</template>

<style scoped>
#teacher-edit-cls {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  flex-grow: 1;
  padding: 8px;
}

#teacher-edit-cls-attrs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 8px;
  background-color: white;
}

#teacher-edit-cls-attrs-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  width: 100%;
}

#teacher-edit-cls-attends {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}
</style>