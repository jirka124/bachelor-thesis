<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProductImage",
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
  <div id="product-image" v-if="product">
    <picture id="product-image-pic">
      <source type="image/webp" :srcset="productUrlPath.webp" width="350" height="350" />
      <source type="image/png" :srcset="productUrlPath.png" width="350" height="350" />
      <img
        :src="productUrlPath.png"
        :alt="`product ${product.productId} preview`"
        width="350"
        height="350"
        fetchpriority="high"
      />
    </picture>
  </div>
</template>

<style scoped>
#product-image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2vh 2vw;
}

#product-image-pic {
  width: 512px;
  height: 512px;
  background-color: #ebfdec;
  border-radius: 16px;
}

#product-image-pic {
  width: 100%;
}

@media only screen and (max-width: 950px) {
  #product-image-pic {
    width: 256px;
    height: 256px;
  }
}

@media only screen and (max-width: 700px) {
  #product-image-pic {
    width: 100%;
    height: auto;
  }
}
</style>
