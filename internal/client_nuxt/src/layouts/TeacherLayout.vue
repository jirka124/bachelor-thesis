<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import TeacherMenu from "@/components/teacher/TeacherMenu.vue";
import TeacherWrapHead from "@/components/teacher/TeacherWrapHead.vue";

export default defineComponent({
  name: "TeacherLayout",
  components: { TeacherMenu, TeacherWrapHead },
  computed: {
    ...mapStores(useTeacherStore),
  },
  methods: {
    async whoami() {
      let r;
      try {
        r = (await this.$api.post("teacher/whoami")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("whoami")) {
          this.teacherStore.setTeacherName(r.result.whoami.teacherName);
          this.teacherStore.setTeacherId(r.result.whoami.teacherId);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.whoami();
  },
});
</script>

<template>
  <div id="cont">
    <TeacherMenu />
    <div id="teacher-wrap">
      <TeacherWrapHead />
      <slot />
    </div>
  </div>
</template>

<style scoped>
#cont {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  overflow-x: hidden;
}

#teacher-wrap {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: calc(100% - 80px);
  background-color: #EEEEEE;
}

@media only screen and (max-width: 512px) {
  #cont {
    flex-direction: column;
  }

  #teacher-wrap {
    width: 100%;
  }
}
</style>
