<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "ProductInteract",
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      MIN_ADD_COUNT: 1,
      MAX_ADD_COUNT: 99,
      toAddCount: 1,
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  watch: {
    toAddCount() {
      this.normalizeCount();
    },
  },
  methods: {
    addToCart() {
      this.userStore.addToCart(this.product.productId, this.toAddCount);
      this.$cookies.set("plant_cart", JSON.stringify(this.userStore.cart), 0);
    },
    incCount() {
      ++this.toAddCount;
    },
    decCount() {
      --this.toAddCount;
    },
    normalizeCount() {
      this.toAddCount = Math.min(
        this.MAX_ADD_COUNT,
        Math.max(this.MIN_ADD_COUNT, this.toAddCount)
      );
    },
  },
});
</script>

<template>
  <div id="product-interact" v-if="product">
    <h1 id="product-interact-name">{{ product.name }}</h1>
    <i id="product-interact-price">&dollar; {{ product.price }}</i>
    <div id="product-interact-cart">
      <div id="product-interact-cart-control">
        <button @click="decCount"><i class="fa-solid fa-minus"></i></button>
        <input type="number" v-model="toAddCount" />
        <button @click="incCount"><i class="fa-solid fa-plus"></i></button>
      </div>
      <button id="product-interact-cart-btn" class="btn-1" @click="addToCart">
        Add to cart
      </button>
    </div>
    <div id="product-interact-type">
      <i class="fa-solid fa-t"></i> Levitating flower pot
    </div>
    <div id="product-interact-desc"><i class="fa-solid fa-tag"></i> Description</div>
    <div id="product-interact-desc-text">
      {{ product.description }}
    </div>
    <div id="product-interact-feat"><i class="fa-solid fa-list"></i> Features</div>
    <div id="product-interact-feat-items">
      <p v-show="product.features.length < 1">No product features found :(</p>
      <p
        class="product-interact-feat-item"
        v-for="feature in product.features"
        :key="feature.fKey"
      >
        {{ feature.fKey }}: {{ feature.fValue }}
      </p>
      <i>* size: height x length x width</i>
    </div>
  </div>
</template>

<style scoped>
#product-interact {
  padding: 4vh 1.6vw 2vh 1.6vw;
}
#product-interact-name {
  font-size: 28px;
}
#product-interact-price {
  font-size: 18px;
  display: block;
  margin: 16px 0;
}
#product-interact-cart {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1vh 1vw;
}
#product-interact-cart-control {
  display: flex;
  border: 3px solid #808080;
  border-radius: 50px;
  overflow: hidden;
}
#product-interact-cart-control > button,
#product-interact-cart-control > input {
  background-color: transparent;
  border: none;
  outline: none;
}
#product-interact-cart-control > button {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: all 0.2s;
}
#product-interact-cart-control > button:hover {
  color: #bdbdbd;
  background-color: #757575;
}
#product-interact-cart-control > input {
  text-align: center;
  max-width: 80px;
  height: 40px;
}
/* Chrome, Safari, Edge, Opera */
#product-interact-cart-control > input::-webkit-outer-spin-button,
#product-interact-cart-control > input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
#product-interact-cart-control > input[type="number"] {
  -moz-appearance: textfield;
}
#product-interact-cart-btn {
}
#product-interact-type,
#product-interact-desc,
#product-interact-feat {
  font-size: 18px;
  margin-top: 16px;
}
#product-interact-type > i,
#product-interact-desc > i,
#product-interact-feat > i {
  font-size: 20px;
}
#product-interact-desc-text {
  padding-left: 6px;
}
#product-interact-feat-items {
  padding-left: 6px;
}
.product-interact-feat-item {
}
</style>
