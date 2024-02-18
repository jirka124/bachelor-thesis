<script>
import { defineComponent } from "vue";
import ProductPreview from "@/components/ProductPreview.vue";

export default defineComponent({
  name: "ProductSimilar",
  components: { ProductPreview },
  props: {
    products: {
      type: Array,
      default() {
        return [];
      },
    },
  },
});
</script>

<template>
  <div id="product-similar">
    <div id="product-similar-like">
      <i class="fa-solid fa-notes-medical"></i> You may also like
    </div>
    <div id="product-similar-list">
      <ProductPreview
        v-for="product in products"
        :key="product.productId"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped>
#product-similar {
}
#product-similar-like {
  font-size: 18px;
  margin: 16px 0;
}
#product-similar-like > i {
  font-size: 20px;
}
#product-similar-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 2vh 1vw;
}
</style>
