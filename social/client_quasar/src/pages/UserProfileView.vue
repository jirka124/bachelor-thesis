<script>
import { defineComponent } from "vue";
import { api, createAPI } from "@/boot/axios.js";
import { Cookies } from 'quasar'
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";
import PostComp from "@/components/app/PostComp.vue";
import FriendComp from "@/components/app/FriendComp.vue";
import UserAvatar from "@/components/app/UserAvatar.vue";

export default defineComponent({
  name: "UserProfileView",
  components: { PostComp, FriendComp, UserAvatar },
  preFetch({ store, currentRoute, ssrContext }) {
    const userId = currentRoute.params.userId || null;
    const userStore = useUserStore(store);

    // make sure cookies are passed by in server context
    let usedApi = api;
    if (process.env.SERVER) {
      const cookies = Cookies.parseSSR(ssrContext);

      const cookieStr = Object.entries(cookies.getAll())
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");

      usedApi = createAPI({
        headers: {
          Cookie: cookieStr,
        },
      });
    }

    const fetchPageSSR = async (userId) => {
      // fetch basic info about user (indexed)
      let r;
      try {
        const reqBody = { userId };
        if (process.env.SERVER) reqBody.path = currentRoute.fullPath;

        r = (await usedApi.post("user/view-user-profile-ssr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("userObj")) userStore.setViewedUserProfile(r.result.userObj);
      } catch (error) {
        console.error(error);
      }
    };

    return fetchPageSSR(userId);
  },
  data() {
    return {
      currentMenuToggle: "posts",
    }
  },
  watch: {
    "$route.params.userId"() {
      this.resetPage();
    },
  },
  computed: {
    ...mapStores(useUserStore),
    userProfile() {
      return this.userStore.viewedUserProfile || {
        accessLevel: "guest", // "own", "friend", "guest"
        isFriend: null,
        userId: 0,
        login: "NONAME",
        description: "NODESCRIPTION",
        avatar: 1,
        signupDate: new Date()
      }
    },
    hasAccess() {
      return this.userProfile.accessLevel === "own" || this.userProfile.accessLevel === "friend";
    },
    canEdit() {
      return this.userProfile.accessLevel === "own";
    },
    isFriend() {
      if (this.userProfile.isFriend === true) return true;
      else if (this.userProfile.isFriend === false) return false;
      return null;
    },
    userId() {
      return this.userProfile.userId || 0
    },
    avatarId() {
      return this.userProfile.avatar || 1
    },
    userName() {
      return this.userProfile.login || "";
    },
    userDescription() {
      return this.userProfile.description ? this.userProfile.description : "Information is LOCKED 🔒";
    },
    userSince() {
      return this.userProfile.signupDate ? `Member of SoConnect since ${new Date(this.userProfile.signupDate).getFullYear()}` : "Information is LOCKED 🔒";
    },
    userPosts() {
      return this.userStore.viewedUserProfilePosts || [];
    },
    userFriends() {
      return this.userStore.viewedUserProfileFriends || [];
    }
  },
  methods: {
    resetPage() {
      const userId = this.$route.params.userId || null;
      this.fetchUserSSR(userId);
      this.fetchUserCSR(userId);
    },
    async fetchUserSSR(userId) {
      // fetch basic info about user (indexed)
      let r;
      try {
        const reqBody = { userId };
        if (this.isServer || true) reqBody.path = this.$route.fullPath;

        r = (await api.post("user/view-user-profile-ssr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("userObj")) this.userStore.setViewedUserProfile(r.result.userObj);

      } catch (error) {
        console.error(error);
      }
    },
    async fetchUserCSR(userId) {
      // fetch users posts and friends
      let r;
      try {
        const reqBody = { userId };
        if (this.isServer || true) reqBody.path = this.$route.fullPath;

        r = (await api.post("user/view-user-profile-csr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("posts"))
          this.userStore.setViewedUserProfilePosts(r.result.posts, r.result.likes, r.result.likeCounts, r.result.replyCounts);
        if (r.result.hasOwnProperty("friends"))
          this.userStore.setViewedUserProfileFriends(r.result.friends);
      } catch (error) {
        console.error(error);
      }
    },
    async saveUserDescription(e) {
      const description = e.target.value;
      if (description === this.userDescription) return;

      let r;
      try {
        r = (await this.$api.post("user/save-user-description", { description })).data;
        if (r.reqState !== null) console.log(r.reqState);

      } catch (error) {
        console.error(error);
      }
    },
    async deleteFriend() {
      const userId = this.$route.params.userId || null;

      let r;
      try {
        r = (await this.$api.post("user/delete-friend", { userId })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    async addFriend() {
      if (!this.userStore.isLogged) return this.$router.push({ name: "login" });

      const userId = this.$route.params.userId || null;

      let r;
      try {
        r = (await this.$api.post("user/add-friend", { userId })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      let r;
      try {
        r = (await this.$api.post("user/logout")).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    const userId = this.$route.params.userId || null;
    // this.fetchUserSSR(userId);
    this.fetchUserCSR(userId);
  },
});
</script>

<template>
  <div id="view-profile">
    <div id="view-profile-meta">
      <UserAvatar id="view-profile-meta-pic" :userId="userId" :avatarId="avatarId" />
      <div id="view-profile-meta-user">
        {{ userName }}
        <button v-if="isFriend === false" @click="addFriend" class="view-profile-meta-user-act"><i
            class="fa-solid fa-user-plus"></i></button>
        <button v-if="isFriend === true" @click="deleteFriend" class="view-profile-meta-user-act"><i
            class="fa-solid fa-user-minus"></i></button>
        <button v-if="userProfile.accessLevel === 'own'" @click="logout" class="view-profile-meta-user-act"><i
            class="fa-solid fa-arrow-right-from-bracket"></i></button>
      </div>
      <textarea id="view-profile-meta-desc" class="scroll" placeholder="How would I describe myself..."
        :readonly="!canEdit" v-text="userDescription" @blur="saveUserDescription" maxlength="255"></textarea>
      <i id="view-profile-meta-since">{{ userSince }}</i>
    </div>
    <div v-if="!hasAccess" id="view-profile-more-lock">
      <p>This content is only accessible by users that are friends of viewed user.</p>
      <button @click="addFriend" class="btn-1">Make Friend</button>
    </div>
    <div v-if="hasAccess" id="view-profile-more-menu">
      <button @click="currentMenuToggle = 'posts'" class="btn-1">posts</button>
      <button @click="currentMenuToggle = 'friends'" class="btn-1">friends</button>
    </div>
    <div v-if="hasAccess" v-show="currentMenuToggle === 'posts'" id="view-profile-more-posts">
      <PostComp v-for="post in userPosts" :key="post.postId" :post="post" />
    </div>
    <div v-if="hasAccess" v-show="currentMenuToggle === 'friends'" id="view-profile-more-friends">
      <FriendComp v-for="friend in userFriends" :key="friend.userId" :friend="friend" />
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 16px;
  padding-left: 256px;
  border-radius: 16px;
  background-color: #8CBCDF;
}

.view-profile-meta-user-act {
  width: 32px;
  height: 32px;
  color: white;
  background-color: #192E46;
  cursor: pointer;
  transition: 0.2s background-color;
}

.view-profile-meta-user-act:hover {
  background-color: #225274;
}

.view-profile-meta-user-act>i {}

#view-profile-meta-desc {
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
  padding: 6px 16px;
  padding-left: 256px;
  border: none;
  outline: none;
  resize: none;
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
    min-height: 256px;
    padding-left: 16px;
  }

  #view-profile-meta-since {
    padding-left: 16px;
  }
}
</style>
