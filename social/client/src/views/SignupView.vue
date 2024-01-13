<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SignuView",
});
</script>

<template>
  <div id="signup">
    <picture id="signup-back">
      <source type="image/webp" srcset="@/assets/home-banner-768.webp" media="(max-width: 512px)" />
      <source type="image/webp" srcset="@/assets/home-banner-1280.webp" media="(max-width: 1024px)" />
      <source type="image/jpeg" srcset="@/assets/home-banner-768.jpg" media="(max-width: 512px)" />
      <source type="image/jpeg" srcset="@/assets/home-banner-1280.jpg" media="(max-width: 1024px)" />
      <img src="@/assets/home-banner-1280.jpg" alt="banner" loading="lazy" />
    </picture>
    <div id="signup-form">
      <h1 id="signup-form-title">Signup</h1>
      <div id="signup-form-ins">
        <input type="text" placeholder="Login" class="in">
        <input type="text" placeholder="Password" class="in">
        <input type="text" placeholder="Password" class="in">
      </div>
      <button class="btn-1">SIGNUP</button>
      <button class="btn-2">Already a member? Login</button>
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