<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthHead",
});
</script>

<template>
  <div id="auth-head">
    <img src="@/assets/identity/icon/icon-svg.svg" width="30" height="30" alt="system icon">
    <h2>Attendance Tracker System </h2>
  </div>
</template>

<style scoped>
#auth-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

#auth-head>img {
  height: 30px;
}

#auth-head>h2 {
  font-size: 20px;
  font-weight: normal;
}
</style>
