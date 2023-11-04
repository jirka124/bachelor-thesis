import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ cart: [] }),
  getters: {
    getCartItemCount() {
      return this.cart.reduce((total, item) => ( total + item.count ), 0)
    }
  },
  actions: {
    addToCart(productId, count) {
      let item = this.cart.find(item => item.id === productId)
      if(!item) {
        item = { id: productId, count: 0 }
        this.cart.push(item);
      }

      // allow max of 99 items per product
      item.count = Math.min(99, item.count + count);
    }
  },
})

