<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useAdminStore } from "@/stores/admin";
import ProductRow from "@/components/admin/ProductRow.vue";
import AdminLogged from "@/components/admin/AdminLogged.vue";

export default defineComponent({
  name: "AdminView",
  components: { ProductRow, AdminLogged },
  computed: {
    ...mapStores(useAdminStore),
  },
  methods: {
    async fetchProducts() {
      // fetch list of products
      let r;
      try {
        r = (await this.$api.post("admin/view-manage-product-csr")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("products"))
          this.adminStore.setManageProducts(r.result.products);
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
});
</script>

<template>
  <div id="admin-page">
    <AdminLogged />
    <h1>PRODUCT MANAGEMENT</h1>
    <div id="prod-manage">
      <table>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <td></td>
        </tr>
        <ProductRow :product="product" v-for="product in [...[null], ...adminStore.manageProducts]"
          :key="product ? product.productId : null" />
      </table>
    </div>
  </div>
</template>

<style>
#admin-page {
  padding: 16px 8px;
}

#admin-page>h1 {
  font-size: 24px;
  padding: 8px 0;
}

#prod-manage {
  padding: 16px;
  border: 1px dashed rgb(128, 128, 128);
}
</style>
