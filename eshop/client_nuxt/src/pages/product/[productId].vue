<script>
import { defineComponent } from "vue";
import ProductImage from "@/components/product/ProductImage.vue";
import ProductInteract from "@/components/product/ProductInteract.vue";
import ProductSimilar from "@/components/product/ProductSimilar.vue";
import ProductReviews from "@/components/product/ProductReviews.vue";
import { api } from "@/plugins/02.axios.js";
import { mapActions } from "pinia";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "ProductView",
  components: { ProductImage, ProductInteract, ProductSimilar, ProductReviews },
  async setup() {
    const nuxtApp = useNuxtApp();
    const appStore = useAppStore();
    const productId = useRoute().params.productId || null;

    const fetchPageSSR = async (productId) => {
      // fetch basic info about product (indexed)
      let r;
      try {
        const reqBody = { productId };
        if (process.server) reqBody.path = useRoute().fullPath;

        // avoid double fetch, while preserving fully live data
        if (process.server && !nuxtApp.isHydrating)
          clearNuxtData("general/view-product-ssr");

        const { data, error } = await useAsyncData(
          "general/view-product-ssr",
          () => api.post("general/view-product-ssr", reqBody),
          { pick: ["data"] }
        );
        r = data._value.data;

        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("product")) appStore.setOpenProduct(r.result.product);
      } catch (error) {
        console.error(error);
      }
    };

    await fetchPageSSR(productId);
  },
  data() {
    return {
      matchMediaMax700: null,
      isUnder700: true,
    };
  },
  computed: {
    ...mapState(useAppStore, ["openProduct", "openProductSimilar", "openProductReviews"]),
  },
  watch: {
    "$route.params.productId"() {
      this.resetPage();
    },
  },
  methods: {
    ...mapActions(useAppStore, [
      "setOpenProduct",
      "setOpenProductSimilar",
      "setOpenProductReviews",
    ]),
    handleScreenSize() {
      this.isUnder700 = this.matchMediaMax700.matches;
    },
    resetPage() {
      const productId = this.$route.params.productId || null;
      this.fetchPageSSR(productId);
      this.fetchPageCSR(productId);
    },
    async fetchPageSSR(productId) {
      // fetch basic info about product (indexed)
      let r;
      try {
        const reqBody = { productId };
        if (this.isServer || true) reqBody.path = this.$route.fullPath;

        r = (await api.post("general/view-product-ssr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("product")) this.setOpenProduct(r.result.product);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPageCSR(productId) {
      // fetch basic info about product
      let r;
      try {
        r = (await api.post("general/view-product-csr", { productId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("similar"))
          this.setOpenProductSimilar(r.result.similar);
        if (r.result.hasOwnProperty("reviews"))
          this.setOpenProductReviews(r.result.reviews);
      } catch (error) {
        console.error(error);
      }
    },
  },
  async mounted() {
    const productId = this.$route.params.productId || null;
    this.matchMediaMax700 = window.matchMedia("(max-width: 700px)");

    this.handleScreenSize();
    this.matchMediaMax700.addListener(this.handleScreenSize);

    //this.fetchPageSSR(productId);
    this.fetchPageCSR(productId);
  },
  beforeUnmount() {
    this.matchMediaMax700.removeListener(this.handleScreenSize);
  },
});
</script>

<template>
  <div id="product">
    <div id="product-full" v-if="!isUnder700">
      <div id="product-full-l">
        <ProductImage :product="openProduct" />
        <ProductSimilar :products="openProductSimilar" />
      </div>
      <div id="product-full-r">
        <ProductInteract :product="openProduct" />
        <ProductReviews :reviews="openProductReviews" />
      </div>
    </div>
    <div id="product-mobile" v-else>
      <ProductImage :product="openProduct" />
      <ProductInteract :product="openProduct" />
      <ProductSimilar :products="openProductSimilar" />
      <ProductReviews :reviews="openProductReviews" />
    </div>
  </div>
</template>

<style scoped>
#product {
  padding: 80px 2vw 20px 2vw;
}

#product-full {
  display: flex;
  width: 100%;
}

#product-full-l {
  width: 512px;
}

#product-full-r {
  flex-grow: 2;
}

@media only screen and (max-width: 950px) {
  #product-full-l {
    width: 256px;
  }
}
</style>
