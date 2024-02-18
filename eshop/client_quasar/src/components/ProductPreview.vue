<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProductPreview",
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  computed: {
    productUrlPath() {
      return {
        png: `${import.meta.env.PLANT_LEVIT_SERVER_PUBLIC_PATH}/products/png/${
          this.product.productId
        }.png`,
        webp: `${import.meta.env.PLANT_LEVIT_SERVER_PUBLIC_PATH}/products/webp/${
          this.product.productId
        }.webp`,
      };
    },
  },
});
</script>

<template>
  <div class="product-preview" v-if="product">
    <RouterLink :to="{ name: 'product', params: { productId: product.productId } }">
      <div class="product-preview-img">
        <picture>
          <source type="image/webp" :srcset="productUrlPath.webp" />
          <source type="image/png" :srcset="productUrlPath.png" />
          <img
            :src="productUrlPath.png"
            :alt="`product ${product.productId} preview`"
            loading="lazy"
          />
        </picture>
      </div>
    </RouterLink>
    <p class="product-preview-name">{{ product.name }}</p>
    <i class="product-preview-price">&dollar; {{ product.price }}</i>
  </div>
</template>

<style scoped>
.product-preview {
  width: 200px;
  color: #757575;
}
.product-preview-img:hover {
  background-color: #b3e3b5;
  border: 2px dashed #388e3c;
  transform: scale(0.9, 0.9);
}
.product-preview-img {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background-color: #ebfdec;
  border: 2px dashed hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.product-preview-img picture {
  width: 100%;
}
.product-preview-price {
  font-size: 14px;
}
</style>
