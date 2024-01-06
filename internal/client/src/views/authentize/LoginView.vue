<script>
import { defineComponent } from "vue";
import AuthHead from "@/components/authentize/AuthHead.vue";
import AuthRole from "@/components/authentize/AuthRole.vue";

export default defineComponent({
  name: "LoginView",
  components: { AuthHead, AuthRole },
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    async login() {
      let r;
      try {
        r = (
          await this.$api.post("teacher/login", {
            username: this.username,
            pass: this.password,
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
  <div id="auth-login">
    <AuthHead />
    <AuthRole />
    <div id="auth-login-form">
      <div class="iconed-in">
        <i class="fa-solid fa-id-card in-ico"></i>
        <input v-model="username" @keydown.enter="login" class="in" type="text" placeholder="Login">
      </div>
      <div class="iconed-in">
        <i class="fa-solid fa-lock in-ico"></i>
        <input v-model="password" @keydown.enter="login" class="in" type="password" placeholder="Password">
      </div>

      <div id="auth-login-form-act">
        <button class="btn-1" @click="login">Login</button>
        <button class="btn-3">Forgotten password?</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#auth-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 32px;
  padding: 8px;
}

#auth-login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  width: 70%;
}

#auth-login-form .iconed-in {
  width: 100%;
}

#auth-login-form-act {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}

@media only screen and (max-width: 400px) {
  #auth-login-form {
    width: 90%;
  }

  #auth-login-form-act {
    flex-direction: column;
  }
}
</style>