<script>
import { defineComponent } from "vue";
import ProductPreview from "@/components/ProductPreview.vue";
import { mapStores } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "HomeTrending",
  components: { ProductPreview },
  computed: {
    ...mapStores(useAppStore),
  },
});
</script>

<template>
  <div id="trending">
    <h2>Trending right now...</h2>
    <div id="trending-products" class="scroll">
      <p id="trending-products-none" v-if="appStore.trendingProducts.length < 1">
        We are sorry but there are currently no trending product today,
        <a href="/stock">be the first one to shop today.</a>
      </p>
      <ProductPreview
        v-for="product in appStore.trendingProducts"
        :key="product.productId"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
#trending {
  padding: 6vh 4vw;
}
#trending > h2 {
  font-size: 22px;
  padding-bottom: 0.8vh;
}
#trending-products {
  display: flex;
  column-gap: 16px;
  padding: 8px;
  overflow-x: auto;
}
#trending-products-none > a {
  color: #4caf50;
}
#trending-products > .product-preview {
  flex-shrink: 0;
}
</style>
