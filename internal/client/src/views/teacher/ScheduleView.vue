<script>
import { defineComponent } from "vue";
import ScheduleDay from "@/components/schedule/ScheduleDay.vue";
import ScheduleMonth from "@/components/schedule/ScheduleMonth.vue";

export default defineComponent({
  name: "ScheduleView",
  components: { ScheduleDay, ScheduleMonth }
});
</script>

<template>
  <div id="teacher-sched">
    <div id="teacher-sched-quick">
      <div id="teacher-sched-quick-today">
        <div>TODAY</div>
        <ScheduleDay />
      </div>
      <picture id="teacher-sched-quick-illus">
        <source type="image/webp" srcset="@/assets/analytic-illustratino.webp" media="(min-width: 512px)" />
        <source type="image/png" srcset="@/assets/analytic-illustratino.png" media="(min-width: 512px)" />
        <img src="data:," alt="smart image" loading="lazy" />
      </picture>
    </div>
    <div id="teacher-sched-cale">
      <ScheduleMonth />
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