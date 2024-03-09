<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      loginVal: "root",
      passwordVal: "root123",
    }
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    goToSignup() {
      this.$router.push({ name: "signup" });
    },
    async login() {
      let r;
      try {
        r = (
          await this.$api.post("user/login", {
            name: this.loginVal,
            pass: this.passwordVal,
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
  <div id="login">
    <picture id="login-back">
      <source type="image/webp" srcset="@/assets/home-banner-768.webp" media="(max-width: 512px)" width="768"
        height="768" />
      <source type="image/webp" srcset="@/assets/home-banner-1280.webp" media="(max-width: 1024px)" width="1280"
        height="768" />
      <source type="image/jpeg" srcset="@/assets/home-banner-768.jpg" media="(max-width: 512px)" width="768"
        height="768" />
      <source type="image/jpeg" srcset="@/assets/home-banner-1280.jpg" media="(max-width: 1024px)" width="1280"
        height="768" />
      <img src="@/assets/home-banner-1280.jpg" alt="banner" width="1280" height="768" loading="lazy" />
    </picture>
    <div id="login-form">
      <h1 id="login-form-title">LOGIN</h1>
      <div id="login-form-ins">
        <input v-model="loginVal" type="text" placeholder="Login" class="in">
        <input v-model="passwordVal" type="password" placeholder="Password" class="in">
      </div>
      <button @click="login" class="btn-1">LOGIN</button>
      <button @click="goToSignup" class="btn-2">Not a member? Signup</button>
    </div>
  </div>
</template>

<style scoped>
#login {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#login-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#login-back>img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#login-form {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-width: 400px;
  min-height: 400px;
  padding: 16px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.9);
}

#login-form-title {
  font-size: 24px;
}

#login-form-ins>input {}

#login-form-ins {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

#login>button {}

@media only screen and (max-width: 400px) {
  #login-form {
    min-width: auto;
  }
}
</style>
