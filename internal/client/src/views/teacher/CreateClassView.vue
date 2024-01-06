<script>
import { defineComponent } from "vue";
import FieldInput from "@/components/FieldInput.vue";

export default defineComponent({
  name: "CreateClassView",
  components: { FieldInput },
  data() {
    return {
      createLock: false,
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
        id: "AUTO",
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
  methods: {
    goToChoose() {
      this.$router.push({ name: "edit-class-choose" });
    },
    splitDateTime(dateStr) {
      return dateStr.slice(0, -1).split("T")
    },
    async createClass() {
      if (this.createLock) return;
      this.createLock = true;

      let r;
      try {
        r = (await this.$api.post("teacher/create-class", { ...this.values })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToChoose();
      } catch (error) {
        console.error(error);
      }
      this.createLock = false;
    }
  }
});
</script>

<template>
  <div id="teacher-create-cls">
    <FieldInput v-for="field in FIELDS" :key="field.name" :field="field" v-model:value="values[field.name]" />
    <div id="teacher-create-cls-act">
      <button class="btn-1" @click="createClass">Create</button>
      <button class="btn-3" @click="goToChoose">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
#teacher-create-cls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: calc(100% - 16px);
  max-height: calc(100% - 16px);
  padding: 16px 8px;
  border-radius: 8px;
  background-color: white;
  margin: 8px;
}

#teacher-create-cls-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  width: 100%;
}
</style>