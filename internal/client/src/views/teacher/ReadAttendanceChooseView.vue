<script>
import { defineComponent } from "vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "ReadAttendanceChooseView",
  components: { TableComp },
  data() {
    return {
      tableConfig: {
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
              ico: "fa-solid fa-eye",
              event: "view-class",
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
              ico: "fa-solid fa-eye",
              event: "view-class",
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
              ico: "fa-solid fa-eye",
              event: "view-class",
              eventParams: { id: 3 }
            }
          },
        ]
      }
    }
  },
  methods: {
    viewClass({ id }) {
      console.log(id);
      this.$router.push({ name: "read-attend" })
    }
  }
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