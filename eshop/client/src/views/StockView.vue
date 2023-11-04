<script>
import { defineComponent } from "vue";
import StockFilter from "@/components/stock/StockFilter.vue";
import StockProducts from "@/components/stock/StockProducts.vue";
import StockPagination from "@/components/stock/StockPagination.vue";
import { mapActions } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "StockView",
  components: { StockFilter, StockProducts, StockPagination },
  data() {
    return {
      currentSrchVal: this.$route.query.srchFor || "",
      currentSortVal: this.$route.query.sortType || "feat",
      currentPageVal: this.$route.query.pagination || 1,
      fetchOptimizerInst: null,
    };
  },
  watch: {
    currentSrchVal(newVal) {
      this.changeQueryParam("srchFor", newVal);
      this.fetchOnPageProducts();
    },
    currentSortVal(newVal) {
      this.changeQueryParam("sortType", newVal);
      this.fetchOnPageProducts();
    },
    currentPageVal(newVal) {
      this.changeQueryParam("pagination", newVal);
      this.fetchOnPageProducts();
    },
  },
  methods: {
    ...mapActions(useAppStore, ["setStockProducts", "setStockProductsTotalCount"]),
    async fetchOnPageProducts() {
      let delay = 0;
      if (this.fetchOptimizerInst) {
        clearTimeout(this.fetchOptimizerInst);
        delay = 1000;
      }
      await this.delay(delay);
      return this.fetchOnPageProductsRun();
    },
    async fetchOnPageProductsRun() {
      // fetch product on page, based on choosen params
      let r;
      try {
        r = (
          await this.$api.post("general/view-stock-products-csr", {
            srchVal: this.currentSrchVal,
            sortVal: this.currentSortVal,
            pageVal: this.currentPageVal,
          })
        ).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("products")) this.setStockProducts(r.result.products);
        if (r.result.hasOwnProperty("totalCount"))
          this.setStockProductsTotalCount(r.result.totalCount);
      } catch (error) {
        console.error(error);
      }
    },
    srchValChanged(srchVal) {
      this.currentSrchVal = srchVal;
    },
    sortTypeChanged(sortType) {
      this.currentSortVal = sortType;
    },
    paginationChanged(pagination) {
      this.currentPageVal = pagination;
    },
  },
  async mounted() {
    await this.fetchOnPageProducts();
  },
});
</script>

<template>
  <div id="stock">
    <h1>Our stock</h1>
    <StockFilter
      :currentSrchVal="currentSrchVal"
      :currentSortVal="currentSortVal"
      @changeSrchVal="srchValChanged"
      @changeSortType="sortTypeChanged"
    />
    <StockProducts />
    <StockPagination
      :currentPageVal="currentPageVal"
      @changePagination="paginationChanged"
    />
  </div>
</template>

<style scoped>
#stock {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 2vw 20px 2vw;
  min-height: 100vh;
}
#stock > h1 {
  font-size: 24px;
  text-align: center;
}
</style>
