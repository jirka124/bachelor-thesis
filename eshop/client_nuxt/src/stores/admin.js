export const useAdminStore = defineStore('admin', {
  state: () => ({
    isLoggedAsAdmin: false,
    adminId: null,
    adminName: null,
    manageProducts: []
  }),
  getters: {},
  actions: {
    setIsLoggedAsAdmin(isLogged) {
      this.isLoggedAsAdmin = isLogged
    },
    setAdminId(adminId) {
      this.adminId = adminId
    },
    setAdminName(adminName) {
      this.adminName = adminName
    },
    setManageProducts(products) {
      this.manageProducts = products
    },
    addManageProducts(products) {
      this.manageProducts.push(...products.filter((product) => product.id))
    },
    alterManageProducts(products) {
      products.map((product) => {
        if (!product.id) return
        const mngProduct = this.manageProducts.find((mngProduct) => mngProduct.id === product.id)
        if (mngProduct) {
          if (product.hasOwnProperty('name')) mngProduct.name = product.name
          if (product.hasOwnProperty('description')) mngProduct.description = product.description
          if (product.hasOwnProperty('price')) mngProduct.price = product.price
        }
      })
    },
    delManageProducts(products) {
      products.map((product) => {
        if (!product.id) return
        const mngProductInd = this.manageProducts.findIndex(
          (mngProduct) => mngProduct.id === product.id
        )
        if (mngProductInd > -1) this.manageProducts.splice(mngProductInd, 1)
      })
    }
  }
})
