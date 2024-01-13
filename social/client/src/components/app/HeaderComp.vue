<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HeaderComp",
});
</script>

<template>
  <header>
    <div id="header-l">
      <picture id="header-l-pic">
        <source type="image/webp" srcset="@/assets/identity/icon/icon-64.webp" />
        <source type="image/png" srcset="@/assets/identity/icon/icon-64.png" />
        <img src="@/assets/identity/icon/icon-64.png" alt="company icon" loading="lazy" />
      </picture>
      <button id="header-l-srch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
    <div id="header-r">
      <p id="header-r-user">Username78</p>
      <picture id="header-r-pic">
        <source type="image/webp" srcset="@/assets/user-avatar-man.webp" />
        <source type="image/jpeg" srcset="@/assets/user-avatar-man.jpg" />
        <img src="@/assets/user-avatar-man.jpg" alt="logged user avatar" loading="lazy" />
      </picture>
    </div>
  </header>
</template>

<style scoped>
header {
  z-index: 99;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: linear-gradient(9deg, rgba(25, 46, 70, 1) 0% 0%, rgba(34, 82, 116, 1) 100% 100%);
}

#header-l,
#header-r {
  display: flex;
  align-items: center;
  gap: 8px;
}

#header-l-pic {
  width: 50px;
}

#header-l-pic>img {
  display: block;
}

#header-l-srch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

#header-l-srch>i {
  color: white;
  font-size: 22px;
}

#header-r {}

#header-r-user {
  color: white;
}

#header-r-pic {
  width: 50px;
}

#header-r-pic>img {
  display: block;
}
</style>
