<script>
import { defineComponent } from "vue";
import PostComp from "@/components/app/PostComp.vue";
import FriendComp from "@/components/app/FriendComp.vue";

export default defineComponent({
  name: "UserProfileView",
  components: { PostComp, FriendComp },
  data() {
    return {
      hasAccess: true,
      currentMenuToggle: "posts",
    }
  }
});
</script>

<template>
  <div id="view-profile">
    <div id="view-profile-meta">
      <picture id="view-profile-meta-pic">
        <source type="image/webp" srcset="@/assets/user-avatar-man.webp" />
        <source type="image/jpeg" srcset="@/assets/user-avatar-man.jpg" />
        <img src="@/assets/user-avatar-man.jpg" alt="logged user avatar" loading="lazy" />
      </picture>
      <div id="view-profile-meta-user">Tuliana Jackes</div>
      <div id="view-profile-meta-desc">Adventurer 🌍 | Storyteller 📖 | Coffee Lover ☕ | Exploring the world one step at a
        time. Let's connect and
        share our journeys! 🌟 #Wanderlust</div>
      <i id="view-profile-meta-since">Member of SoConnect since 2023</i>
    </div>
    <div v-if="!hasAccess" id="view-profile-more-lock">
      <p>This content is only accessible by users that are friends of viewed user.</p>
      <button class="btn-1">Friend Reqest</button>
    </div>
    <div v-if="hasAccess" id="view-profile-more-menu">
      <button @click="currentMenuToggle = 'posts'" class="btn-1">posts</button>
      <button @click="currentMenuToggle = 'friends'" class="btn-1">friends</button>
    </div>
    <div v-if="hasAccess" v-show="currentMenuToggle === 'posts'" id="view-profile-more-posts">
      <PostComp v-for="i in [1, 2]" :key="i" />
    </div>
    <div v-if="hasAccess" v-show="currentMenuToggle === 'friends'" id="view-profile-more-friends">
      <FriendComp v-for="i in [1, 2, 3, 4]" :key="i" />
    </div>
  </div>
</template>

<style scoped>
#view-profile {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
  padding: 16px;
}

#view-profile-meta {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 256px;
  padding-bottom: 16px;
  border-radius: 16px;
  background-color: white;
}

#view-profile-meta-pic {
  position: absolute;
  top: 50%;
  left: 30px;
  width: 200px;
  transform: translateY(-50%);
}

#view-profile-meta-user {
  font-size: 24px;
  padding: 16px;
  padding-left: 256px;
  border-radius: 16px;
  background-color: #8CBCDF;
}

#view-profile-meta-desc {
  flex-grow: 1;
  padding: 6px 16px;
  padding-left: 256px;
}

#view-profile-meta-since {
  font-size: 14px;
  padding: 6px 16px;
  padding-left: 256px;
  color: #757575;
}

#view-profile-more-lock {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

#view-profile-more-lock>p {}

#view-profile-more-lock>button {}

#view-profile-more-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

#view-profile-more-menu>button {}

#view-profile-more-posts,
#view-profile-more-friends {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#view-profile-more-friends {}

@media only screen and (max-width: 768px) {
  #view-profile-meta-pic {
    top: 3px;
    left: auto;
    right: 8px;
    width: 64px;
    margin: 0 auto;
    transform: translateY(0);
  }

  #view-profile-meta-pic>img {
    border-radius: 8px;
  }

  #view-profile-meta-user {
    padding-right: 72px;
    padding-left: 16px;
  }

  #view-profile-meta-desc {
    padding-left: 16px;
  }

  #view-profile-meta-since {
    padding-left: 16px;
  }
}
</style>
