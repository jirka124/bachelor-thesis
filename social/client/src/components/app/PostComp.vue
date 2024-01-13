<script>
import { defineComponent } from "vue";
import PostCmnt from "@/components/app/PostCmnt.vue";

export default defineComponent({
  name: "PostComp",
  components: { PostCmnt },
  data() {
    return {
      commentToggleOn: false
    }
  },
  watch: {
    commentToggleOn(newVal) {
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
    }
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
        <picture class="post-meta-pic">
          <source type="image/webp" srcset="@/assets/user-avatar-man.webp" />
          <source type="image/jpeg" srcset="@/assets/user-avatar-man.jpg" />
          <img src="@/assets/user-avatar-man.jpg" alt="user avatar" loading="lazy" />
        </picture>
        <p class="post-meta-user">Tuliana Jackes</p>
        <div class="post-meta-date">
          <i class="fa-regular fa-calendar"></i>
          <p>21.05.2025</p>
        </div>
      </div>
      <textarea class="post-cont" ref="post-text" @keyup="autosizeTextAreaPost"
        @keypress="autosizeTextAreaPost">🌟 Just had the most inspiring conversation on SoConnect! 💬 We discussed our shared love for travel and exchanged tips on hidden gems. It's amazing how this platform connects us with like-minded people from all around the world. Where's your dream destination? 🌍 #TravelDreams #SoConnectCommunity</textarea>
      <div class="post-act">
        <button class="btn-1">196 <i class="fa-regular fa-thumbs-up"></i></button>
        <button @click="commentToggleOn = !commentToggleOn" class="btn-1">265 <i
            class="fa-regular fa-comment"></i></button>
      </div>
    </div>
    <div v-if="commentToggleOn" class="post-extra">
      <div class="post-extra-comment">
        <textarea ref="comment-text" @keyup="autosizeTextAreaComment"
          @keypress="autosizeTextAreaComment">Well, thanks everyone for the great support recieved from y'all. Will keep on doing such content! But this time its the very new post.</textarea>
        <button><i class="fa-regular fa-paper-plane"></i></button>
      </div>
      <div class="post-extra-comments">
        <PostCmnt v-for="i in [1, 2, 3]" :key="i" />
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

.post-meta-pic>img {
  display: block;
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
