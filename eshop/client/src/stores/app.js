import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    trendingProducts: [],
    stockProducts: [],
    stockProductsTotalCount: 0,
    openProduct: null,
    openProductSimilar: [],
    openProductReviews: [],
  }),
  actions: {
    setTrendingProducts(products) {
      this.trendingProducts = products;
    },
    setStockProducts(products) {
      this.stockProducts = products;
    },
    setStockProductsTotalCount(totalCount) {
      this.stockProductsTotalCount = totalCount;
    },
    setOpenProduct(product) {
      this.openProduct = product;
    },
    setOpenProductSimilar(similar) {
      this.openProductSimilar = similar;
    },
    setOpenProductReviews(reviews) {
      this.openProductReviews = reviews;
    },
    prependProductReview(review) {
      if(review === null) return;
      if(this.openProduct.productId !== review.productId) return;

      this.openProductReviews.unshift(review);
    }
  },
})

