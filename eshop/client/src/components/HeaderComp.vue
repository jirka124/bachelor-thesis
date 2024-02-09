<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";

export default defineComponent({
  name: "HeaderComp",
  data() {
    return {
      matchMediaMax720: null,
      isUnder720: true,
      isMenuOn: false,
      isSrchOn: false,
      scrollY: 0,
      hasScrolledDown: false,
    };
  },
  computed: {
    ...mapStores(useUserStore),
    isMenuVisible() {
      return this.isMenuOn || !this.isUnder720;
    },
    headerDynamicStyle() {
      const isHomePage = this.$route.name === "home";
      const style = {};
      if (!isHomePage || this.scrollY > 1 || this.isMenuOn)
        style.backgroundColor = "#EBFDEC";
      if (
        this.hasScrolledDown &&
        (!isHomePage || this.scrollY > 200) &&
        (!this.isMenuOn || !this.isUnder720)
      )
        style.transform = "translateY(-100%)";
      return style;
    },
  },
  methods: {
    handleScreenSize() {
      this.isUnder720 = this.matchMediaMax720.matches;
    },
    handleScroll() {
      if (window.scrollY > this.scrollY) this.hasScrolledDown = true;
      else this.hasScrolledDown = false;

      this.scrollY = window.scrollY;
    },
  },
  mounted() {
    this.matchMediaMax720 = window.matchMedia("(max-width: 720px)");

    this.handleScreenSize();
    this.handleScroll();

    this.matchMediaMax720.addListener(this.handleScreenSize);
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    this.matchMediaMax720.removeListener(this.handleScreenSize);
    window.removeEventListener("scroll", this.handleScroll);
  },
});
</script>

<template>
  <header :style="headerDynamicStyle">
    <div id="header-identity">
      <button id="header-menu-toggle" v-show="isUnder720" @click="isMenuOn = !isMenuOn">
        <i v-show="!isMenuOn" class="fa-solid fa-bars"></i>
        <i v-show="isMenuOn" class="fa-solid fa-xmark"></i>
      </button>

      <RouterLink to="/">
        <picture>
          <source type="image/webp" srcset="@/assets/identity/icon/icon-64.webp" />
          <source type="image/png" srcset="@/assets/identity/icon/icon-64.png" />
          <img id="header-identity-icon" src="@/assets/identity/icon/icon-64.png" alt="company icon" loading="lazy" />
        </picture>
      </RouterLink>
      <b>Plant Levitate</b>
    </div>
    <nav v-show="isMenuVisible">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/stock">Stock</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
    <div id="header-interact">
      <p>{{ userStore.getCartItemCount }}</p>
      <button>
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
      <button @click="isSrchOn = !isSrchOn">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
      <div id="header-interact-srch" v-show="isSrchOn">
        <input type="text" placeholder="Search for..." />
        <button>
          <i class="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  transition: all 0.3s;
}

#header-identity {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

#header-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  background-color: transparent;
  border: none;
}

#header-menu-toggle>i {
  font-size: 20px;
  color: #757575;
}

#header-identity-icon {
  width: 40px;
}

#header-identity>b {
  font-size: 24px;
}

nav>a {
  font-size: 18px;
  text-decoration: none;
  padding: 8px;
  transition: all 0.3s;
  color: #757575;
}

nav>a.router-link-exact-active {
  font-size: 22px;
  text-decoration: underline;
}

#header-interact {
  position: relative;
  display: flex;
  align-items: center;
}

#header-interact-srch {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  max-width: 400px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(100, 100, 100, 0.498);
  transform: translateY(150%);
}

#header-interact-srch>input,
#header-interact-srch>button {
  background-color: transparent;
  border: none;
  outline: none;
  height: 32px;
}

#header-interact-srch>input {
  padding-left: 6px;
}

#header-interact-srch>button {
  width: 32px;
  height: 32px;
  cursor: pointer;
}

#header-interact-srch>button>i {
  color: #757575;
}

#header-interact>p {}

#header-interact>button {
  padding: 4px 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

#header-interact>button>i {
  font-size: 20px;
  color: #757575;
}

@media only screen and (max-width: 720px) {
  nav {
    position: fixed;
    top: 60px;
    left: 0;
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding-top: 20px;
    padding-left: 2vw;
    background-color: #ebfdec;
  }
}

@media only screen and (max-width: 350px) {
  #header-identity>b {
    display: none;
  }
}
</style>
