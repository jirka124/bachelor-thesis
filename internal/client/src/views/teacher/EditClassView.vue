<script>
import { defineComponent } from "vue";
import FieldInput from "@/components/FieldInput.vue";
import TableComp from "@/components/TableComp.vue";

export default defineComponent({
  name: "EditClassView",
  components: { FieldInput, TableComp },
});
</script>

<template>
  <div id="teacher-edit-cls">
    <div id="teacher-edit-cls-attrs">
      <FieldInput v-for="i in new Array(9)" :key="i" />
      <div id="teacher-edit-cls-attrs-act">
        <button class="btn-1">Save</button>
        <button class="btn-2">Delete</button>
        <button class="btn-3">Cancel</button>
      </div>
    </div>
    <div id="teacher-edit-cls-attends">
      <p>Manage attendents</p>
      <TableComp />
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