<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FriendComp",
});
</script>

<template>
  <div class="user-friend">
    <div class="user-friend-meta">
      <picture class="user-friend-meta-pic">
        <source type="image/webp" srcset="@/assets/user-avatar-man.webp" />
        <source type="image/jpeg" srcset="@/assets/user-avatar-man.jpg" />
        <img src="@/assets/user-avatar-man.jpg" alt="user avatar" loading="lazy" />
      </picture>
      <p class="user-friend-meta-user">Tuliana Jackes</p>
    </div>
    <button class="btn-1">view</button>
  </div>
</template>

<style scoped>
.user-friend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

.user-friend-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.user-friend-meta-pic {
  width: 64px;
}

.user-friend-meta-pic>img {
  display: flex;
}

.user-friend-meta-user {}
</style>
