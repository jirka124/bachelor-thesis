<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  computed: {
    layout() {
      if (this.$route.name === "home") return "empty-layout";
      return "app-layout";
    },
  },
});
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
