<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldInput",
  emits: ["saveStateChange"],
  props: {
    name: {
      type: String,
      default: "NO NAME",
    },
    value: {
      default: "",
    },
    input: {
      type: Object,
      default: () => {
        return {};
      },
    },
    needSave: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputAttrs: [
        {
          attrName: "type",
          default: "text",
        },
        {
          attrName: "placeholder",
          default: "",
        },
        {
          attrName: "disabled",
          default: false,
        },
      ],
      newValue: this.value,
    };
  },
  computed: {
    inputObj() {
      const obj = {};
      this.inputAttrs.map((inputAttr) => {
        obj[inputAttr.attrName] = this.input.hasOwnProperty(inputAttr.attrName)
          ? this.input[inputAttr.attrName]
          : inputAttr.default;
      });
      return obj;
    },
  },
  watch: {
    value() {
      this.fieldNeedSave();
    },
    newValue() {
      this.fieldNeedSave();
    },
  },
  methods: {
    fieldNeedSave() {
      this.$emit("saveStateChange", {
        name: this.name,
        newValue: this.newValue,
        needSave: this.value !== this.newValue,
      });
    },
  },
  created() {
    this.fieldNeedSave();
  },
});
</script>

<template>
  <tr>
    <td class="field-name">{{ this.name }}</td>
    <td class="field-input">
      <input :type="this.inputObj.type" :placeholder="this.inputObj.placeholder" :disabled="this.inputObj.disabled"
        v-model="newValue" />
    </td>
    <td class="field-save-state">
      <i v-show="!needSave" class="fa-solid fa-floppy-disk"></i>
      <i v-show="needSave" class="fa-regular fa-floppy-disk"></i>
    </td>
  </tr>
</template>

<style scoped>
tr * {
  font-size: 18px;
}

.field-name {
  text-align: right;
}

.field-input>input {
  padding: 2px 4px;
  border: 1px solid rgb(128, 128, 128);
  border-radius: 8px;
}

.field-save-state>i {}
</style>
