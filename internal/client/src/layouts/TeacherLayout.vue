<script>
import { defineComponent } from "vue";
import TeacherMenu from "@/components/teacher/TeacherMenu.vue";
import TeacherWrapHead from "@/components/teacher/TeacherWrapHead.vue";

export default defineComponent({
  name: "TeacherLayout",
  components: { TeacherMenu, TeacherWrapHead }
});
</script>

<template>
  <div id="cont">
    <TeacherMenu />
    <div id="teacher-wrap">
      <TeacherWrapHead />
      <RouterView />
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
