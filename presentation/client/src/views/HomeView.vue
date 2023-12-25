<script>
import { defineComponent } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeMission from "@/components/home/HomeMission.vue";
import HomeTeam from "@/components/home/HomeTeam.vue";
import HomeFindUs from "@/components/home/HomeFindUs.vue";
import FooterComp from "@/components/FooterComp.vue";

export default defineComponent({
  name: "HomeView",
  components: { HomeBanner, HomeMission, HomeTeam, HomeFindUs, FooterComp },
});
</script>

<template>
  <div id="home">
    <HomeBanner />
    <HomeMission />
    <HomeTeam />
    <HomeFindUs />
    <FooterComp />
  </div>
</template>

<style scoped>
#home {}
</style>
<style>
.home-caption {
  font-size: 26px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 8px;
  padding: 6px 0;
}

.home-caption>h2 {
  font-size: 22px;
}

@media only screen and (max-width: 800px) {
  .home-caption {
    padding: 12px 0 18px 0;

    text-align: center;
    justify-content: center;
  }
}
</style>
