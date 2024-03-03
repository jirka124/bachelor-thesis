<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";
import PostCmnt from "@/components/app/PostCmnt.vue";
import UserAvatar from "@/components/app/UserAvatar.vue";

export default defineComponent({
  name: "PostComp",
  components: { PostCmnt, UserAvatar },
  emits: ["update:modelValue"],
  props: {
    readonly: {
      type: Boolean,
      default: true
    },
    post: {
      type: Object,
      default() {
        return null;
      }
    },
    modelValue: {}
  },
  data() {
    return {
      commentToggleOn: false,
      commentVal: ""
    }
  },
  computed: {
    ...mapStores(useUserStore),
    userId() {
      if (this.readonly) return this.post && this.post.userId ? this.post.userId : 0;
      return this.userStore.userId ? this.userStore.userId : 0;
    },
    avatarId() {
      if (this.readonly) return this.post && this.post.avatar ? this.post.avatar : 1;
      return this.userStore.userAvatar ? this.userStore.userAvatar : 1;
    },
    userName() {
      if (this.readonly) return this.post && this.post.login ? this.post.login : "NONAME";
      return this.userStore.userName ? this.userStore.userName : "NONAME";
    },
    postDate() {
      if (this.readonly) return this.post && this.post.createDate ? new Date(this.post.createDate).toLocaleDateString() : "NODATE";
      return new Date().toLocaleDateString();
    },
    postContent() {
      if (this.readonly) return this.post && this.post.content ? this.post.content : "NOCONTENT";
      return this.modelValue;
    },
    likeCount() {
      if (this.readonly) return this.post ? this.post.likeCount || 0 : 0;
      return 0;
    },
    replyCount() {
      if (this.readonly) return this.post ? this.post.replyCount || 0 : 0;
      return 0;
    },
    postComments() {
      if (this.readonly) return this.post && this.post.comments ? this.post.comments : [];
      return [];
    }
  },
  watch: {
    commentToggleOn(newVal) {
      if (this.readonly) return;
      if (newVal) setTimeout(() => this.autosizeTextAreaComment(), 0);
    }
  },
  methods: {
    initTextAreas() {
      this.autosizeTextAreaPost();
      this.autosizeTextAreaComment();
    },
    autosizeTextAreaPost() {
      const textElm = this.$refs["post-text"];
      this.autosizeTextAreaAny(textElm);
    },
    autosizeTextAreaComment() {
      const textElm = this.$refs["comment-text"];
      this.autosizeTextAreaAny(textElm);
    },
    autosizeTextAreaAny(textElm) {
      if (!textElm) return;
      textElm.style.height = "0";
      const scrollHeight = textElm.scrollHeight;
      textElm.style.height = `${scrollHeight}px`;
    },
    likeToggle() {
      if (!this.readonly) return;
      this.post.hasLiked ? this.unlikePost() : this.likePost();
    },
    commentToggle() {
      if (!this.readonly) return;
      this.commentToggleOn = !this.commentToggleOn;
      this.fetchComments();
    },
    postInput(e) {
      this.$emit("update:modelValue", e.target.value);
    },
    async likePost() {
      let r;
      try {
        r = (await this.$api.post("user/like-post", { postId: this.post.postId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("likeObj")) {
          this.userStore.setLikeOnPost(r.result.likeObj, this.$route);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async unlikePost() {
      let r;
      try {
        r = (await this.$api.post("user/unlike-post", { postId: this.post.postId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("likeObj")) {
          this.userStore.setLikeOnPost(r.result.likeObj, this.$route);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchComments() {
      let r;
      try {
        r = (await this.$api.post("user/fetch-post-comments", { postId: this.post.postId })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("commentObj")) {
          this.userStore.setPostComments(r.result.commentObj, this.$route);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createPostComment() {
      let r;
      try {
        r = (await this.$api.post("user/create-post-comment", { postId: this.post.postId, commentVal: this.commentVal })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.commentVal = "";

        if (r.result.hasOwnProperty("commentObj")) {
          this.userStore.addPostComment(r.result.commentObj, this.$route);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  updated() {
    this.initTextAreas();
  },
  mounted() {
    this.initTextAreas();
    window.addEventListener("resize", this.initTextAreas);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.initTextAreas);
  }
});
</script>

<template>
  <div class="post-comp">
    <div class="post-box">
      <div class="post-meta">
        <UserAvatar class="post-meta-pic" :userId="userId" :avatarId="avatarId" />
        <p class="post-meta-user">{{ userName }}</p>
        <div class="post-meta-date">
          <i class="fa-regular fa-calendar"></i>
          <p>{{ postDate }}</p>
        </div>
      </div>
      <textarea class="post-cont" ref="post-text" @keyup="autosizeTextAreaPost" @keypress="autosizeTextAreaPost"
        @input="postInput" v-text="postContent" :readonly="readonly" placeholder="Type a post..."></textarea>
      <div class="post-act">
        <button @click="likeToggle" class="btn-1">{{ likeCount }} <i
            :class="{ 'fa-regular': !readonly || !post || !post.hasLiked, 'fa-solid': readonly && post && post.hasLiked }"
            class="fa-thumbs-up"></i></button>
        <button @click="commentToggle" class="btn-1">{{ replyCount }} <i class="fa-regular fa-comment"></i></button>
      </div>
    </div>
    <div v-if="commentToggleOn" class="post-extra">
      <div class="post-extra-comment">
        <textarea ref="comment-text" @keyup="autosizeTextAreaComment" @keypress="autosizeTextAreaComment"
          v-model="commentVal" placeholder="Type a comment..."></textarea>
        <button @click="createPostComment"><i class="fa-regular fa-paper-plane"></i></button>
      </div>
      <div class="post-extra-comments">
        <PostCmnt v-for="comment in postComments" :key="comment.postCommentId" :comment="comment" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-comp {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.post-box {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  border-radius: 16px;
  background-color: white;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 16px;
  background-color: #8CBCDF;
}

.post-meta-pic {
  width: 40px;
}

.post-meta-user {
  font-size: 18px;
}

.post-meta-date {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #757575;
}

.post-meta-date>i {
  font-size: 18px;
}

.post-meta-date>p {
  font-size: 14px;
}

.post-cont {
  padding: 8px;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
}

.post-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px;
}

.post-act>button {}

.post-act>button>i {}

.post-extra {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.post-extra-comment {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background-color: white;
}

.post-extra-comment>textarea {
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
}

.post-extra-comment>button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.post-extra-comment>button>i {
  font-size: 20px;
}

.post-extra-comments {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
