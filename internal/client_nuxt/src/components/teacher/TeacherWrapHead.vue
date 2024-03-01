<script>
import { defineComponent } from "vue";
import { mapState } from 'pinia';
import { useTeacherStore } from "@/stores/teacher";

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
    ...mapState(useTeacherStore, ['teacherName']),
    routeName() {
      return (this.routeNames[this.$route.name] || "NONE").toUpperCase();
    }
  },
  methods: {
    async logout() {
      let r;
      try {
        r = (
          await this.$api.post("teacher/logout")
        ).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    },
  }
});
</script>

<template>
  <div id="teacher-wrap-head">
    <div id="teacher-wrap-head-sec">{{ routeName }}</div>
    <div id="teacher-wrap-head-usr">
      <i class="fa-solid fa-user-tie"></i>
      <p>{{ teacherName }}@uhk.cz <i @click="logout" class="fa-solid fa-right-from-bracket"></i></p>
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

#teacher-wrap-head-usr>p>i {
  padding: 0 6px;
  cursor: pointer;
}
</style>
