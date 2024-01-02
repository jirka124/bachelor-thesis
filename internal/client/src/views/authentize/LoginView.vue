<script>
import { defineComponent } from "vue";
import AuthHead from "@/components/authentize/AuthHead.vue";
import AuthRole from "@/components/authentize/AuthRole.vue";

export default defineComponent({
  name: "LoginView",
  components: { AuthHead, AuthRole }
});
</script>

<template>
  <div id="auth-login">
    <AuthHead />
    <AuthRole />
    <div id="auth-login-form">
      <div class="iconed-in">
        <i class="fa-solid fa-id-card in-ico"></i>
        <input class="in" type="text" placeholder="Login">
      </div>
      <div class="iconed-in">
        <i class="fa-solid fa-lock in-ico"></i>
        <input class="in" type="password" placeholder="Password">
      </div>

      <div id="auth-login-form-act">
        <button class="btn-1">Login</button>
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