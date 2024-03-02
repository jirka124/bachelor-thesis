<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  computed: {
    layout() {
      return "guest-layout";
    },
  },
});
</script>

<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>
