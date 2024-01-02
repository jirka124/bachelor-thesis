<script>
import { defineComponent } from "vue";
import FieldInput from "@/components/FieldInput.vue";

export default defineComponent({
  name: "EditAttendantView",
  components: { FieldInput },
});
</script>

<template>
  <div id="teacher-edit-att">
    <FieldInput v-for="i in new Array(2)" :key="i" />
    <div id="teacher-edit-att-act">
      <button class="btn-1">Save</button>
      <button class="btn-2">Delete</button>
      <button class="btn-3">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
#teacher-edit-att {
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

#teacher-edit-att-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  width: 100%;
}
</style>