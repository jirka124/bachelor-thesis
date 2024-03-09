<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeBanner",
  data() {
    return {
      menuToggleOn: false
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: "login" });
    },
    goToSignup() {
      this.$router.push({ name: "signup" });
    },
  }
});
</script>

<template>
  <div id="banner">
    <picture id="banner-back">
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
    <div v-show="menuToggleOn" id="banner-mobile-menu">
      <div class="banner-mobile-menu-item">
        <div><i class="fa-solid fa-link"></i></div>
        <p @click="goToLogin">LOGIN</p>
      </div>
      <div class="banner-mobile-menu-item">
        <div><i class="fa-solid fa-link"></i></div>
        <p @click="goToSignup">SIGNUP</p>
      </div>
    </div>
    <div id="banner-masking"></div>
    <div id="banner-cont">
      <div id="banner-cont-sloga">Where Conversations Thrive, Connections Flourish</div>
      <button @click="goToLogin" id="banner-cont-act" class="btn-1">Enter</button>
    </div>
    <header>
      <div id="header-left">
        <picture id="header-icon">
          <source type="image/webp" srcset="@/assets/identity/icon/icon-64.webp" width="64" height="64" />
          <source type="image/png" srcset="@/assets/identity/icon/icon-64.png" width="64" height="64" />
          <img src="@/assets/identity/icon/icon-64.png" alt="company icon" width="64" height="64" loading="lazy" />
        </picture>
        <h1 id="header-comp">SoConnect</h1>
        <p @click="goToLogin" id="header-log">Login</p>
        <p @click="goToSignup" id="header-sig">Signup</p>
      </div>
      <div id="header-right"><i @click="menuToggleOn = !menuToggleOn" class="fa-solid fa-bars"></i></div>
    </header>
  </div>
</template>

<style scoped>
#banner {
  position: relative;
  width: 100%;
  height: 100vh;
}

#banner-back>img {
  display: block;
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
}

#banner-mobile-menu {
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100vh;
  background-color: #5BB8CA;
}

.banner-mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.banner-mobile-menu-item:hover {
  background-color: #48a3b5;
}

.banner-mobile-menu-item>div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #AFE64E;
}

.banner-mobile-menu-item>div>i {
  font-size: 24px;
}

.banner-mobile-menu-item>p {
  font-size: 22px;
  padding-right: 8px;
}

#banner-masking {
  z-index: 8;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(9deg, rgba(25, 46, 70, 1) 0% 0%, rgba(34, 82, 116, 1) 100% 100%);

  mask-image: url('@/assets/home-banner-mask.svg');
  mask-size: 100% auto;
  mask-repeat: no-repeat;
  mask-position: top;
  pointer-events: none;
}

header {
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

#header-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding-top: 0.4vw;
}

#header-right {
  display: none;
  margin-right: 16px;
}

#header-right>i {
  font-size: 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

#header-right>i:active {
  color: #AFE64E;
}

#header-icon {
  width: 64px;
  cursor: pointer;
}

#header-icon>img {
  display: block;
}

#header-comp {
  font-size: 28px;
  color: white;
}

#header-log,
#header-sig {
  font-size: 24px;
  color: #BDBDBD;
  cursor: pointer;
}

#banner-cont {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
}

#banner-cont-sloga {
  text-align: center;
  font-size: 22px;
  padding: 24px;
  border-radius: 24px;
  background-color: white;
  max-width: 80%;
}

#banner-cont-act {
  font-weight: bold;
}

@media only screen and (max-width: 1000px) {
  #banner-masking {
    mask-size: 1000px auto;
  }
}

@media only screen and (max-width: 768px) {
  #banner-masking {
    mask-image: url('@/assets/home-banner-mask-mobile.svg');
    mask-size: 100% auto;
  }

  #header-log,
  #header-sig {
    display: none;
  }

  #header-right {
    display: block;
  }
}

@media only screen and (max-width: 600px) {
  #banner-masking {
    mask-size: 600px auto;
  }
}
</style>
