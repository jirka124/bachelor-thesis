<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import FieldInput from "@/components/FieldInput.vue";

export default defineComponent({
  name: "EditAttendantView",
  components: { FieldInput },
  data() {
    return {
      saveLock: false,
      deleteLock: false,
      FIELDS: [
        {
          name: "id",
          displayName: "ID",
          type: "text",
          ico: "fa-solid fa-database",
          isDisabled: true
        },
        {
          name: "name",
          displayName: "Name",
          type: "text",
          ico: "fa-solid fa-database",
        },
      ],
      values: {
        id: "AUTO",
        name: "",
      }
    }
  },
  computed: {
    ...mapStores(useTeacherStore),
  },
  methods: {
    goToChoose() {
      const classId = parseInt(this.$route.query.classId) || null;
      this.$router.push({ name: "edit-class", params: { classId } });
    },
    async fetchAttend() {
      // fetch current fields of attendant
      let r;
      try {
        const attendId = parseInt(this.$route.params.attendId) || null;
        if (attendId === null) return;

        r = (await this.$api.post("teacher/view-edit-attendant-csr", { attendId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("attendObj"))
          this.teacherStore.setEditedAttendant(r.result.attendObj);

        this.values.id = this.teacherStore.editedAttendant.id || "NONE";
        this.values.name = this.teacherStore.editedAttendant.name || "";
      } catch (error) {
        console.error(error);
      }
    },
    async saveAttend() {
      if (this.saveLock) return;
      this.saveLock = true;

      let r;
      try {
        r = (await this.$api.post("teacher/save-attendant", { ...this.values })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToChoose();
      } catch (error) {
        console.error(error);
      }
      this.saveLock = false;
    },
    async deleteAttend() {
      if (this.deleteLock) return;
      this.deleteLock = true;

      const attendId = parseInt(this.$route.params.attendId) || null;
      let r;
      try {
        r = (await this.$api.post("teacher/delete-attendant", { attendId })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToChoose();
      } catch (error) {
        console.error(error);
      }
      this.deleteLock = false;
    }
  },
  mounted() {
    this.fetchAttend();
  },
});
</script>

<template>
  <div id="teacher-edit-att">
    <FieldInput v-for="field in FIELDS" :key="field.name" :field="field" v-model:value="values[field.name]" />
    <div id="teacher-edit-att-act">
      <button class="btn-1" @click="saveAttend">Save</button>
      <button class="btn-2" @click="deleteAttend">Delete</button>
      <button class="btn-3" @click="goToChoose">Cancel</button>
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