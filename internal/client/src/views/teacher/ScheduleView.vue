<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useTeacherStore } from "@/stores/teacher";
import ScheduleDay from "@/components/schedule/ScheduleDay.vue";
import ScheduleMonth from "@/components/schedule/ScheduleMonth.vue";

export default defineComponent({
  name: "ScheduleView",
  components: { ScheduleDay, ScheduleMonth },
  computed: {
    ...mapStores(useTeacherStore),
    daySchedule() {
      return this.getDaySchedule(this.teacherStore.allTeacherClasses, new Date());
    }
  },
  methods: {
    async fetchClasses() {
      // fetch list of classes that belongs to logged teacher
      let r;
      try {
        r = (await this.$api.post("teacher/view-schedule-csr")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("classes"))
          this.teacherStore.setAllTeacherClasses(r.result.classes);
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.fetchClasses();
  },
});
</script>

<template>
  <div id="teacher-sched">
    <div id="teacher-sched-quick">
      <div id="teacher-sched-quick-today">
        <div>TODAY</div>
        <ScheduleDay :daySchedule="daySchedule" />
      </div>
      <picture id="teacher-sched-quick-illus">
        <source type="image/webp" srcset="@/assets/analytic-illustratino.webp" media="(min-width: 512px)" width="500"
          height="500" />
        <source type="image/png" srcset="@/assets/analytic-illustratino.png" media="(min-width: 512px)" width="500"
          height="500" />
        <img src="data:," alt="smart image" width="500" height="500" loading="lazy" />
      </picture>
    </div>
    <div id="teacher-sched-cale">
      <ScheduleMonth :allClasses="teacherStore.allTeacherClasses" />
    </div>

  </div>
</template>

<style scoped>
#teacher-sched {
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  gap: 16px;
  padding: 8px;
}

#teacher-sched-quick {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-grow: 2;
  min-width: 300px;
  max-width: 600px;
}

#teacher-sched-quick-today {
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
}

#teacher-sched-quick-today>div {}

#teacher-sched-quick-illus {
  width: 80%;
}

#teacher-sched-quick-illus>img {
  width: 100%;
}

#teacher-sched-cale {
  display: flex;
  flex-direction: column;
  flex-grow: 3;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
}

@media only screen and (max-width: 512px) {
  #teacher-sched-quick {
    min-width: auto;
    max-width: none;
    width: 100%;
  }

  #teacher-sched-quick-illus {
    display: none;
  }
}

@media only screen and (max-width: 768px) {
  #teacher-sched {
    flex-wrap: wrap;
  }

  #teacher-sched-quick {
    max-width: none;
  }
}
</style>