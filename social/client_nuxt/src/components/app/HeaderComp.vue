<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";
import UserAvatar from "@/components/app/UserAvatar.vue";

export default defineComponent({
  name: "HeaderComp",
  components: { UserAvatar },
  computed: {
    ...mapStores(useUserStore),
    username() {
      return this.userStore.userName !== null ? this.userStore.userName : "guest"
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "home" });
    }
  }
});
</script>

<template>
  <header>
    <div id="header-l">
      <picture @click="goToHome" id="header-l-pic">
        <source type="image/webp" srcset="@/assets/identity/icon/icon-64.webp" width="64" height="64" />
        <source type="image/png" srcset="@/assets/identity/icon/icon-64.png" width="64" height="64" />
        <img src="@/assets/identity/icon/icon-64.png" alt="company icon" width="64" height="64" loading="lazy" />
      </picture>
      <button id="header-l-srch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>
    <div id="header-r">
      <p id="header-r-user">{{ username }}</p>
      <UserAvatar id="header-r-pic" :userId="userStore.userId" :avatarId="userStore.userAvatar" />
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
  cursor: pointer;
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
