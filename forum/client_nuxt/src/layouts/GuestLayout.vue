<script setup>
import HeaderComp from "@/components/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";
</script>

<template>
  <HeaderComp />
  <div id="cont">
    <slot />
  </div>
  <FooterComp />
</template>

<style scoped>
#cont {
  min-height: 100vh;
  margin-top: 60px;
  padding: 2vh 2vw;
  background-color: #F1F1F1;
}
</style>
