<script>
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";
import HeaderComp from "@/components/app/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";


export default defineComponent({
  name: "AdminLayout",
  components: { RouterView, HeaderComp, FooterComp },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    async whoami() {
      let r;
      try {
        r = (await this.$api.post("user/whoami")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("whoami")) {
          this.userStore.setUserName(r.result.whoami.userName);
          this.userStore.setUserId(r.result.whoami.userId);
          this.userStore.setUserAvatar(r.result.whoami.userAvatar)
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
  <HeaderComp />
  <div id="cont">
    <RouterView />
  </div>
  <FooterComp />
</template>

<style scoped>
#cont {
  background-color: #E1E1E1;
}
</style>
