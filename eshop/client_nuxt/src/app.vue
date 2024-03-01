<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  computed: {
    layout() {
      if (this.$route.path.startsWith("/admin")) return "admin-layout";
      return "main-layout";
    },
  },
});
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
