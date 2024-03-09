<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeBanner",
  data() {
    return {
      menuToggleOn: false,
    }
  }
});
</script>

<template>
  <div id="home-banner">
    <picture id="home-banner-back">
      <source type="image/webp" srcset="@/assets/banner-512.webp" media="(max-width: 512px)" width="512" height="640" />
      <source type="image/webp" srcset="@/assets/banner-1024.webp" media="(max-width: 1024px)" width="1024"
        height="683" />
      <source type="image/webp" srcset="@/assets/banner-2048.webp" media="(min-width: 2048px)" width="2048"
        height="1365" />
      <source type="image/jpeg" srcset="@/assets/banner-512.jpg" media="(max-width: 512px)" width="512" height="640" />
      <source type="image/jpeg" srcset="@/assets/banner-1024.jpg" media="(max-width: 1024px)" width="1024"
        height="683" />
      <source type="image/jpeg" srcset="@/assets/banner-2048.jpg" media="(min-width: 2048px)" width="2048"
        height="1365" />
      <img src="@/assets/banner-1024.jpg" alt="leader" width="1024" height="683" fetchpriority="high" />
    </picture>
    <div id="home-banner-intro">
      <h1 id="home-banner-title">The Unity<span>Vanguard</span></h1>
      <picture id="home-banner-icon">
        <source type="image/webp" srcset="@/assets/identity/icon/icon-375.webp" width="375" height="375" />
        <source type="image/png" srcset="@/assets/identity/icon/icon-375.png" width="375" height="375" />
        <img src="@/assets/identity/icon/icon-375.png" alt="icon" width="375" height="375" fetchpriority="high" />
      </picture>
      <p id="home-banner-motto">Strength in Diversity,<br /> Progress for All</p>
    </div>
    <div id="home-banner-menu-tgl" v-show="!menuToggleOn">
      <i class="fa-solid fa-bars" @click="menuToggleOn = true"></i>
    </div>
    <div id="home-banner-menu" v-show="menuToggleOn">
      <div><i class="fa-solid fa-xmark" @click="menuToggleOn = false"></i></div>
      <a href="#home-mission" class="menu-item" @click="menuToggleOn = false">MISSION</a>
      <a href="#home-team" class="menu-item" @click="menuToggleOn = false">Representatives</a>
      <a href="#home-find" class="menu-item" @click="menuToggleOn = false">contact</a>
    </div>
  </div>
</template>

<style scoped>
#home-banner {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  min-height: 100vh;
  background-color: #333;
}

#home-banner-back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#home-banner-back>img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

#home-banner-intro {
  z-index: 3;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
}

#home-banner-title {
  font-size: 40px;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

#home-banner-title>span {
  font-size: 50px;
  color: #FFD700;
}

#home-banner-icon {
  width: 375px;
}

#home-banner-icon>img {
  width: 100%;
}

#home-banner-motto {
  font-size: 22px;
  color: #BDBDBD;
}

#home-banner-menu-tgl {
  z-index: 3;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-grow: 2;
  padding: 12px;
  color: white;
}

#home-banner-menu-tgl>i {
  font-size: 32px;
  cursor: pointer;
}

#home-banner-menu {
  z-index: 4;
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 300px;
  height: calc(100% - 24px);
  padding: 6px;
  background-color: rgba(255, 255, 255, 0.8);
}

#home-banner-menu>div:nth-of-type(1) {
  text-align: right;
}

#home-banner-menu>div:nth-of-type(1)>i {
  font-size: 32px;
  cursor: pointer;
}

.menu-item {
  font-size: 22px;
  text-align: center;
  color: black;
}

.menu-item:focus,
.menu-item:hover {
  color: #bfa10d;
}

@media only screen and (max-width: 800px) {
  #home-banner {
    flex-wrap: wrap;
  }

  #home-banner-intro {
    width: 100%;
  }

  #home-banner-icon {
    width: 375px;
  }

  #home-banner-menu-tgl {
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  #home-banner-menu {
    top: 0;
    right: 0;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
  }

  #home-banner-menu>div:nth-of-type(1) {
    text-align: center;
    order: 4;
    margin-top: 1vh;
  }

  #home-banner-menu>div:nth-of-type(1)>i {
    font-size: 40px;
  }

  .menu-item {
    font-size: 30px;
  }
}

@media only screen and (max-width: 400px) {
  #home-banner {
    overflow: hidden;
  }

  #home-banner-title {
    font-size: 4.8vh;
  }

  #home-banner-title>span {
    font-size: 5.8vh;
  }

  #home-banner-motto {
    font-size: 3vh;
  }

  #home-banner-icon {
    width: 80%;
  }
}
</style>
