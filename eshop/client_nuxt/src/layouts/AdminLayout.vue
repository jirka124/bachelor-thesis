<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useAdminStore } from "@/stores/admin";
import AdminHeaderComp from "@/components/admin/AdminHeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";

export default defineComponent({
  name: "AdminLayout",
  components: { AdminHeaderComp, FooterComp },
  computed: {
    ...mapStores(useAdminStore),
  },
  methods: {
    async whoami() {
      let r;
      try {
        r = (await this.$api.post("admin/whoami")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("whoami")) {
          this.adminStore.setAdminName(r.result.whoami.adminName);
          this.adminStore.setAdminId(r.result.whoami.adminId);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.whoami();
  },
});
</script>

<template>
  <AdminHeaderComp />
  <div id="cont">
    <slot />
  </div>
  <FooterComp />
</template>

<style scoped>
#cont {
  min-height: calc(100vh - 80px);
}
</style>
