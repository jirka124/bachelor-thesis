<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PostCmnt",
});
</script>

<template>
  <div class="post-cmnt">
    <div class="post-cmnt-meta">
      <picture class="post-cmnt-meta-pic">
        <source type="image/webp" srcset="@/assets/user-avatar-man.webp" />
        <source type="image/jpeg" srcset="@/assets/user-avatar-man.jpg" />
        <img src="@/assets/user-avatar-man.jpg" alt="user avatar" loading="lazy" />
      </picture>
      <p class="post-cmnt-meta-user">Tuliana Jackes</p>
      <div class="post-cmnt-meta-date">
        <i class="fa-regular fa-calendar"></i>
        <p>21.05.2025</p>
      </div>
    </div>
    <div class="post-cmnt-cont">🌟 Just had the most inspiring conversation on SoConnect! 💬 We discussed our shared love
      for
      travel and exchanged tips on hidden gems. It's amazing how this platform connects us with like-minded people from
      all around the world. Where's your dream destination? 🌍 #TravelDreams #SoConnectCommunity</div>
  </div>
</template>

<style scoped>
.post-cmnt {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  background-color: white;
}

.post-cmnt-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 16px;
}

.post-cmnt-meta-pic {
  width: 40px;
}

.post-cmnt-meta-pic>img {
  display: block;
}

.post-cmnt-meta-user {
  font-size: 18px;
}

.post-cmnt-meta-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #757575;
}

.post-cmnt-meta-date>i {
  font-size: 18px;
}

.post-cmnt-meta-date>p {
  font-size: 14px;
}

.post-cmnt-cont {
  padding: 8px 12px;
}
</style>
