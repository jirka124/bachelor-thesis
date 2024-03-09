<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthRole",
});
</script>

<template>
  <div id="auth-role">
    <div id="auth-role-avatar">
      <img src="@/assets/teacher-icon.svg" width="129" height="129" alt="role icon">
    </div>
    <p id="auth-role-name">TEACHER ACCESS</p>
  </div>
</template>

<style scoped>
#auth-role {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
}

#auth-role-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #B2EBF2;
}

#auth-role-avatar>img {
  width: 86%;
}

#auth-role-name {}
</style>
