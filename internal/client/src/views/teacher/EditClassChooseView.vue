<script>
import { defineComponent } from "vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "EditClassChooseView",
  components: { TableComp },
  data() {
    return {

    }
  },
});
</script>

<template>
  <div id="teacher-edit-cls-choose">
    <TableComp />
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