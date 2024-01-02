<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldInput",
  props: ['value'],
  emits: ['update:value'],
  methods: {
    toggleCheck() {
      this.$emit('update:value', this.value)
    }
  }
});
</script>

<template>
  <div class="field-input">
    <div class="field-input-name">Field name</div>
    <div class="field-input-input iconed-in">
      <i class="fa-solid fa-magnifying-glass in-ico"></i>
      <input class="in" type="text" placeholder="">
    </div>
  </div>
</template>

<style scoped>
.field-input {
  flex-grow: 1;
  padding: 8px;
  border-radius: 4px;
  border: 2px solid #B2EBF2;
}

*>.field-input:nth-of-type(even) {
  background-color: #DDF5F7;
}

*>.field-input:nth-of-type(odd) {
  background-color: #F2FDFE;
}

.field-input-name {
  padding: 6px 0;
}

.field-input-input {
  min-width: 200px;
}
</style>
