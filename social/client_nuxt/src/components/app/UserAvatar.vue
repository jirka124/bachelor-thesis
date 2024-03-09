<script>
import { defineComponent } from "vue";

import otherAvatarWebp from "@/assets/user-avatar-other.webp";
import otherAvatarJpg from "@/assets/user-avatar-other.jpg";
import manAvatarWebp from "@/assets/user-avatar-man.webp";
import manAvatarJpg from "@/assets/user-avatar-man.jpg";
import womanAvatarWebp from "@/assets/user-avatar-woman.webp";
import womanAvatarJpg from "@/assets/user-avatar-woman.jpg";

export default defineComponent({
  name: "UserAvatar",
  props: {
    userId: {
      type: Number,
      default: null
    },
    avatarId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    userAvatarWebp() {
      if (this.avatarId === null) return otherAvatarWebp;
      else if (this.avatarId === 2) return manAvatarWebp;
      else if (this.avatarId === 3) return womanAvatarWebp;
      return otherAvatarWebp;
    },
    userAvatarJpg() {
      if (this.avatarId === null) return otherAvatarJpg;
      else if (this.avatarId === 2) return manAvatarJpg;
      else if (this.avatarId === 3) return womanAvatarJpg;
      return otherAvatarJpg;
    }
  },
  methods: {
    goToUserProfile() {
      this.$router.push({ name: "view-user", params: { userId: this.userId } })
    }
  }
});
</script>

<template>
  <picture @click="goToUserProfile" class="user-avatar">
    <source type="image/webp" :srcset="userAvatarWebp" width="512" height="512" />
    <source type="image/jpeg" :srcset="userAvatarJpg" width="512" height="512" />
    <img :src="userAvatarJpg" :alt="`user (${userId}) avatar`" width="512" height="512" loading="lazy" />
  </picture>
</template>

<style scoped>
.user-avatar {
  cursor: pointer;
}

.user-avatar:hover {
  transform: scale(1.05, 1.05);
}

.user-avatar>img {
  display: block;
  width: 100%;
}
</style>
