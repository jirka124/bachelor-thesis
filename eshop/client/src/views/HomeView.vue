<script>
import { defineComponent } from "vue";
import HomeBanner from "@/components/home/HomeBanner.vue";
import HomeTrending from "@/components/home/HomeTrending.vue";
import HomeWelcome from "@/components/home/HomeWelcome.vue";
import HomeWorkflow from "@/components/home/HomeWorkflow.vue";
import { mapActions } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "HomeView",
  components: { HomeBanner, HomeTrending, HomeWelcome, HomeWorkflow },
  async mounted() {
    // fetch treding now products
    let r;
    try {
      r = (await this.$api.post("general/view-home-csr")).data;
      if (r.reqState !== null) console.log(r.reqState);

      if (r.result.hasOwnProperty("products"))
        this.setTrendingProducts(r.result.products);
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    ...mapActions(useAppStore, ["setTrendingProducts"]),
  },
});
</script>

<template>
  <div id="home">
    <HomeBanner />
    <HomeTrending />
    <HomeWelcome />
    <HomeWorkflow />
  </div>
</template>

<style scoped>
#home {
}
</style>
