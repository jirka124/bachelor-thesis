<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useAdminStore } from "@/stores/admin";

export default defineComponent({
  name: "AdminLoginView",
  data() {
    return {
      adminName: "",
      adminPass: "",
    };
  },
  computed: {
    ...mapStores(useAdminStore),
  },
  methods: {
    async login() {
      let r;
      try {
        r = (
          await this.$api.post("admin/login", {
            name: this.adminName,
            pass: this.adminPass,
          })
        ).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <div id="admin-login-page">
    <div id="admin-login-ask">
      <i class="fa-solid fa-robot"></i>
      <h2>Are you system Root?</h2>
    </div>
    <div id="admin-login-fields">
      <input type="text" placeholder="ADMIN NAME" v-model="adminName" />
      <input type="password" placeholder="ADMIN PASSWORD" v-model="adminPass" />
    </div>
    <button class="btn-1" @click="login">AUTH</button>
  </div>
</template>

<style>
#admin-login-page {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
  padding: 16px 8px;
}

#admin-login-page > div {
  display: flex;
  flex-direction: column;
}

#admin-login-ask {
  padding: 2vh 0;
}

#admin-login-ask * {
  font-size: 28px;
}

#admin-login-fields {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

#admin-login-fields > input {
  text-align: center;
  font-size: 28px;
  min-width: 400px;
  padding: 6px;
  border-radius: 32px;
  border: 3px solid rgb(128, 128, 128);
}

@media (max-width: 400px) {
  #admin-login-fields > input {
    min-width: auto;
  }
}
</style>
