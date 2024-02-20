<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldInput",
  props: {
    value: {},
    field: {
      type: Object,
      default() { return null }
    }
  },
  emits: ['update:value'],
  computed: {
    isSelect() {
      return this.field.type === "select";
    }
  },
  methods: {
    changeValue(e) {
      this.$emit('update:value', e.target.value)
    }
  }
});
</script>

<template>
  <div v-if="field !== null" class="field-input">
    <div class="field-input-name">{{ field.displayName }}</div>
    <div v-if="isSelect" class="field-input-select iconed-sel">
      <i :class="`${field.ico} sel-ico`"></i>
      <select :value="value" @change="changeValue" class="sel">
        <option v-for="opt in field.options" :key="opt.name" :value="opt.name">{{ opt.displayName }}</option>
      </select>
    </div>
    <div v-else class="field-input-input iconed-in">
      <i :class="`${field.ico} in-ico`"></i>
      <input :value="value" @input="changeValue" class="in" :type="field.type" placeholder=""
        :disabled="field.isDisabled">
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
