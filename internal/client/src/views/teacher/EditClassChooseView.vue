<script>
import { defineComponent } from "vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "EditClassChooseView",
  components: { TableComp },
  data() {
    return {
      tableConfig: {
        allowNew: true,
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
        data: [
          {
            id: 2,
            subject: "subject",
            day: "day",
            tBy: "time by",
            tTill: "time till",
            recurrence: "recurrence",
            cBy: "continuance by",
            cTill: "continuance till",
            minAtt: "min. attend",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-class",
              eventParams: { id: 1 }
            }
          },
          {
            id: 7,
            subject: "subject",
            day: "day",
            tBy: "time by",
            tTill: "time till",
            recurrence: "recurrence",
            cBy: "continuance by",
            cTill: "continuance till",
            minAtt: "min. attend",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-class",
              eventParams: { id: 2 }
            }
          },
          {
            id: 4,
            subject: "subject",
            day: "day",
            tBy: "time by",
            tTill: "time till",
            recurrence: "recurrence",
            cBy: "continuance by",
            cTill: "continuance till",
            minAtt: "min. attend",
            act1: {
              ico: "fa-solid fa-pen",
              event: "edit-class",
              eventParams: { id: 3 }
            }
          },
        ]
      }
    }
  },
  methods: {
    createNew() {
      this.$router.push({ name: "create-class" })
    },
    editClass({ id }) {
      console.log(id);
      this.$router.push({ name: "edit-class" })
    }
  }
});
</script>

<template>
  <div id="teacher-edit-cls-choose">
    <TableComp :config="tableConfig" @create-new="createNew" @edit-class="editClass" />
  </div>
</template>

<style scoped>
#teacher-edit-cls-choose {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 8px;
}
</style>