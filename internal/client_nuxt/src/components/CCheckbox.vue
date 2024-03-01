<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "CCheckbox",
  props: ['checked'],
  emits: ['update:checked'],
  methods: {
    toggleCheck() {
      this.$emit('update:checked', !this.checked)
    }
  }
});
</script>

<template>
  <div class="c-checkbox" :class="{ checked: checked }" @click="toggleCheck"></div>
</template>

<style scoped>
.c-checkbox {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 2px solid #0097A7;
  background-color: transparent;
  cursor: pointer;
}

.c-checkbox.checked {
  background-color: #0097A7;
}
</style>
