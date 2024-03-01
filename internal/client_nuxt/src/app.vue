<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  computed: {
    layout() {
      if (this.$route.path.startsWith("/teacher")) return "teacher-layout";
      return "authentize-layout";
    },
  },
});
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
