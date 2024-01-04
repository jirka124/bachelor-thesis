<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TeacherWrapHead",
  data() {
    return {
      routeNames: {
        schedule: "My Schedule",
        "write-attend": "Write Attendance",
        "read-attend-choose": "Choose Class",
        "read-attend": "Read Attendance",
        "edit-class-choose": "Choose Class",
        "edit-class": "Edit Class",
        "create-class": "Create Class",
        "edit-att": "Edit Attendant",
        "create-att": "Create Attendant"
      }
    }
  },
  computed: {
    routeName() {
      return this.routeNames[this.$route.name].toUpperCase();
    }
  }
});
</script>

<template>
  <div id="teacher-wrap-head">
    <div id="teacher-wrap-head-sec">{{ routeName }}</div>
    <div id="teacher-wrap-head-usr">
      <i class="fa-solid fa-user-tie"></i>
      <p>teacher_login@uhk.cz</p>
    </div>
  </div>
</template>

<style scoped>
#teacher-wrap-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
}

#teacher-wrap-head-sec {
  font-size: 20px;
}

#teacher-wrap-head-usr {
  display: flex;
  align-items: center;
  gap: 8px;
}

#teacher-wrap-head-usr>i {
  font-size: 20px;
}

#teacher-wrap-head-usr>p {}
</style>
