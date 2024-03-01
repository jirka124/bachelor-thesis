<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { RouterView } from "vue-router";
import { useUserStore } from "@/stores/user";
import HeaderComp from "@/components/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";

export default defineComponent({
  name: "MainLayout",
  components: { HeaderComp, FooterComp, RouterView },
  computed: {
    ...mapStores(useUserStore),
  },
  mounted() {
    // sync the user cart from cookies to pinia
    this.userStore.cart = useCookie("plant_cart");
  },
});
</script>

<template>
  <HeaderComp />
  <div id="cont">
    <slot />
  </div>
  <FooterComp />
</template>

<style scoped></style>
