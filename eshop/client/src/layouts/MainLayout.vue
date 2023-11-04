<script setup>
import { RouterView } from "vue-router";
import HeaderComp from "@/components/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";
</script>

<template>
  <HeaderComp />
  <div id="cont"><RouterView /></div>
  <FooterComp />
</template>

<style scoped></style>
