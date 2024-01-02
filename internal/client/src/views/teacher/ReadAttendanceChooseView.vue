<script>
import { defineComponent } from "vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "ReadAttendanceChooseView",
  components: { TableComp },
  data() {
    return {

    }
  },
});
</script>

<template>
  <div id="teacher-read-att-choose">
    <TableComp />
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