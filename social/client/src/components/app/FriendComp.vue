<script>
import { defineComponent } from "vue";
import UserAvatar from "@/components/app/UserAvatar.vue";

export default defineComponent({
  name: "FriendComp",
  components: { UserAvatar },
  props: {
    friend: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  computed: {
    userId() {
      return this.friend && this.friend.userId ? this.friend.userId : 0;
    },
    avatarId() {
      return this.friend && this.friend.avatar ? this.friend.avatar : 1;
    },
    userName() {
      return this.friend && this.friend.login ? this.friend.login : "NONAME";
    }
  },
  methods: {
    goToFriendProfile(userId) {
      this.$router.push({ name: "view-user", params: { userId } })
    },
  }
});
</script>

<template>
  <div class="user-friend">
    <div class="user-friend-meta">
      <UserAvatar class="user-friend-meta-pic" :userId="userId" :avatarId="avatarId" />
      <p class="user-friend-meta-user">{{ userName }}</p>
    </div>
    <button @click="goToFriendProfile(userId)" class="btn-1">view</button>
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
