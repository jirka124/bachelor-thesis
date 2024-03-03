<script>
import { defineComponent } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeWelcome from "@/components/home/HomeWelcome.vue";
import HomeIntro from "@/components/home/HomeIntro.vue";
import HomeJoin from "@/components/home/HomeJoin.vue";
import FooterComp from "@/components/FooterComp.vue";

export default defineComponent({
  name: "HomeView",
  components: { HomeBanner, HomeWelcome, HomeIntro, HomeJoin, FooterComp },
});
</script>

<template>
  <div id="home">
    <HomeBanner />
    <HomeWelcome />
    <HomeIntro />
    <HomeJoin />
    <FooterComp />
  </div>
</template>

<style scoped>
#home {}
</style>
