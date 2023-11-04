<script>
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "StockPagination",
  emits: ["changePagination"],
  data() {
    return {
      pageSize: 20,
      pageVal: 1,
    };
  },
  computed: {
    ...mapState(useAppStore, ["stockProductsTotalCount", "stockProducts"]),
    maxPageCount() {
      return Math.ceil(this.stockProductsTotalCount / this.pageSize);
    },
  },
  watch: {
    pageVal(newVal) {
      this.$emit("changePagination", newVal);
    },
  },
  methods: {
    pageBack(by) {
      if (by === null) this.pageVal = 1;
      else this.pageVal = Math.max(this.pageVal - by, 1);
    },
    pageFront(by) {
      if (by === null) this.pageVal = this.maxPageCount;
      else this.pageVal = Math.min(this.pageVal + by, this.maxPageCount);
    },
  },
});
</script>

<template>
  <div id="stock-pagination" v-show="stockProducts.length > 0">
    <button @click="pageBack(null)"><i class="fa-solid fa-angles-left"></i></button>
    <hr />
    <button @click="pageBack(1)"><i class="fa-solid fa-angle-left"></i></button>
    <hr />
    <div>PAGE {{ pageVal }} OF {{ maxPageCount }}</div>
    <hr />
    <button @click="pageFront(1)"><i class="fa-solid fa-angle-right"></i></button>
    <hr />
    <button @click="pageFront(null)"><i class="fa-solid fa-angles-right"></i></button>
  </div>
</template>

<style scoped>
#stock-pagination {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 4vh auto 0 auto;
  border: 2px solid #757575;
  border-radius: 16px;
  overflow: hidden;
}
#stock-pagination > button {
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}
#stock-pagination > button:hover {
  color: #bdbdbd;
  background-color: #757575;
}
#stock-pagination > hr {
  width: 1px;
  height: 40px;
  background-color: #757575;
}
#stock-pagination > div {
  padding: 0 16px;
}
</style>
