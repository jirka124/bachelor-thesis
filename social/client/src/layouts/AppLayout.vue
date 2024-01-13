<script setup>
import { RouterView } from "vue-router";
import HeaderComp from "@/components/app/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";
</script>

<template>
  <HeaderComp />
  <div id="cont">
    <RouterView />
  </div>
  <FooterComp />
</template>

<style scoped>
#cont {
  background-color: #E1E1E1;
}
</style>
