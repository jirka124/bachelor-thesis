<script>
import { defineComponent } from "vue";
import ProductPreview from "@/components/ProductPreview.vue";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "StockProducts",
  components: { ProductPreview },
  computed: {
    ...mapState(useAppStore, ["stockProducts"]),
  },
});
</script>

<template>
  <div id="stock-products">
    <p v-show="stockProducts.length < 1">
      We are sorry, we could not found any product matching your reqirement...
    </p>
    <ProductPreview
      v-for="product in stockProducts"
      :key="product.productId"
      :product="product"
    />
  </div>
</template>

<style scoped>
#stock-products {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4vh 1.8vw;
  width: 100%;
}

@media only screen and (max-width: 500px) {
  #stock-products {
    justify-content: center;
  }
}
</style>
