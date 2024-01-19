<script>
import { defineComponent } from "vue";
import UserAvatar from "@/components/app/UserAvatar.vue";

export default defineComponent({
  name: "PostCmnt",
  components: { UserAvatar },
  props: {
    comment: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  computed: {
    userId() {
      return this.comment && this.comment.userId ? this.comment.userId : 0;
    },
    avatarId() {
      return this.comment && this.comment.avatar ? this.comment.avatar : 1;
    },
    userName() {
      return this.comment && this.comment.login ? this.comment.login : "NONAME";
    },
    date() {
      return this.comment && this.comment.date ? new Date(this.comment.date).toLocaleDateString() : "NODATE";
    },
    content() {
      return this.comment && this.comment.content ? this.comment.content : "NOCONTENT";
    },
  }
});
</script>

<template>
  <div class="post-cmnt">
    <div class="post-cmnt-meta">
      <UserAvatar class="post-cmnt-meta-pic" :userId="userId" :avatarId="avatarId" />
      <p class="post-cmnt-meta-user">{{ userName }}</p>
      <div class="post-cmnt-meta-date">
        <i class="fa-regular fa-calendar"></i>
        <p>{{ date }}</p>
      </div>
    </div>
    <div class="post-cmnt-cont">{{ content }}</div>
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
