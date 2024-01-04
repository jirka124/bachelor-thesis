<script>
import { defineComponent } from "vue";
import FieldInput from "@/components/FieldInput.vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "EditClassView",
  components: { FieldInput, TableComp },
  data() {
    return {
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
      },
      tableConfig: {
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
        data: [
          {
            id: 2,
            name: "Jurička Matěj",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-attend",
              eventParams: { id: 2 }
            }
          },
          {
            id: 7,
            name: "Alois Jirásek",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-attend",
              eventParams: { id: 7 }
            }
          },
          {
            id: 1,
            name: "Gargamel",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-attend",
              eventParams: { id: 1 }
            }
          },
        ]
      }
    }
  },
  methods: {
    goToChoose() {
      this.$router.push({ name: "edit-class-choose" });
    },
    createNew() {
      this.$router.push({ name: "create-att" })
    },
    editAttend({ id }) {
      console.log(id);
      this.$router.push({ name: "edit-att" })
    },
    splitDateTime(dateStr) {
      return dateStr.slice(0, -1).split("T")
    }
  }
});
</script>

<template>
  <div id="teacher-edit-cls">
    <div id="teacher-edit-cls-attrs">
      <FieldInput v-for="field in FIELDS" :key="field.name" :field="field" :value="values[field.name]" />
      <div id="teacher-edit-cls-attrs-act">
        <button class="btn-1">Save</button>
        <button class="btn-2">Delete</button>
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