<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "SignuView",
  data() {
    return {
      loginVal: "",
      passwordVal: "",
      passwordAgVal: ""
    }
  },
  computed: {
    ...mapStores(useUserStore),
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    async signup() {
      if (this.passwordVal !== this.passwordVal) return alert("Passwords must match!");

      let r;
      try {
        r = (
          await this.$api.post("user/signup", {
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
  <div id="signup">
    <picture id="signup-back">
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
    <div id="signup-form">
      <h1 id="signup-form-title">Signup</h1>
      <div id="signup-form-ins">
        <input v-model="loginVal" minlength="1" maxlength="32" type="text" placeholder="Login" class="in">
        <input v-model="passwordVal" minlength="1" type="password" placeholder="Password" class="in">
        <input v-model="passwordAgVal" minlength="1" type="password" placeholder="Password" class="in">
      </div>
      <button @click="signup" class="btn-1">SIGNUP</button>
      <button @click="goToLogin" class="btn-2">Already a member? Login</button>
    </div>
  </div>
</template>

<style scoped>
#signup {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

#signup-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#signup-back>img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#signup-form {
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

#signup-form-title {
  font-size: 24px;
}

#signup-form-ins>input {}

#signup-form-ins {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

#signup>button {}

@media only screen and (max-width: 400px) {
  #signup-form {
    min-width: auto;
  }
}
</style>