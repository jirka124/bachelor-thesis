<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderComp",
  data() {
    return {
      srchOn: false,
      srchFor: ""
    }
  },
  methods: {
    closeWindow(e) {
      if (e.srcElement === this.$refs["closing-area"]) this.srchOn = false;
    },
    searchFor() {
      this.$router.push({ name: "search-guest", query: { srchFor: this.srchFor } });
      this.srchOn = false;
    }
  }
});
</script>

<template>
  <header>
    <div id="header-identity">
      <RouterLink to="/">
        <picture>
          <source type="image/webp" srcset="@/assets/identity/icon/icon-64.webp" width="64" height="64" />
          <source type="image/png" srcset="@/assets/identity/icon/icon-64.png" width="64" height="64" />
          <img id="header-identity-icon" src="@/assets/identity/icon/icon-64.png" alt="company icon" width="64"
            height="64" loading="lazy" />
        </picture>
      </RouterLink>
      <h2>DebateMingle</h2>
    </div>
    <button @click="srchOn = true" id="header-srch"><i class="fa-solid fa-magnifying-glass"></i></button>
    <transition>
      <div v-show="srchOn" @click="closeWindow" id="header-srch-on" ref="closing-area">
        <div id="header-srch-on-act">
          <input v-model="srchFor" @keydown.enter="searchFor" type="text" placeholder="Awaiting your orders">
          <button @click="searchFor" class="btn-1">Search</button>
        </div>
        <div id="header-srch-on-off">
          <i class="fa-solid fa-xmark"></i>
          <p>Click outside to close the search</p>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
@keyframes jump {

  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-5px);
  }

  60% {
    transform: translateY(-2.5px);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

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
  height: 60px;
  padding: 2px 4px;
  background-color: white;
}

#header-identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

#header-identity picture {
  animation: jump 2s infinite;
}

#header-identity-icon {
  width: 50px;
}

#header-identity>h2 {
  font-size: 24px;
  font-weight: normal;
  color: black;
}

#header-srch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

#header-srch>i {
  font-size: 22px;
}

#header-srch-on {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  background-color: white;
}

#header-srch-on-act {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

#header-srch-on-act>input {
  font-size: 26px;
  text-align: center;
  width: 400px;
  padding: 8px 0;
  border: 4px solid #64BFB5;
  border-width: 4px 0;
  outline: none;
  transition: 0.2s all;
}

#header-srch-on-act>input:focus-within {
  border-color: #999;
}

#header-srch-on-act>button {}

#header-srch-on-off {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#header-srch-on-off>i {}

#header-srch-on-off>p {}
</style>
