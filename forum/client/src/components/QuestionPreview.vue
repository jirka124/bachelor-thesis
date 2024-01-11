<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuestionPreview",
  props: {
    post: {
      type: Object,
      default: null
    }
  },
  methods: {
    goToPost() {
      this.$router.push({ name: "discuss-guest", params: { postId: this.post.postId } });
    }
  }
});
</script>

<template>
  <div v-if="post" @click="goToPost" class="question-prev">
    <div class="question-prev-title">
      <h3>{{ post.title || "ERROR" }}</h3>
      <div class="question-prev-title-art"><i class="fa-solid fa-comment-dots"></i></div>
    </div>
    <div class="question-prev-more">
      <div class="question-prev-more-main">
        <p>{{ new Date(post.date).toLocaleDateString() || "ERROR" }}</p>
        <p>{{ post.name || "ERROR" }}</p>
      </div>
      <div class="question-prev-more-info">
        <p>{{ post.viewCount || 0 }} views</p>
        <p>{{ post.replyCount || 0 }} replies</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.question-prev {
  flex: 1;
  min-width: 280px;
  max-width: 600px;
  cursor: pointer;
}

.question-prev-title {
  position: relative;
  border-radius: 8px;
  color: white;
  background-color: #D86A22;
}

.question-prev-title>h3 {
  z-index: 1;
  position: relative;
  text-align: center;
  padding: 8px 40px 8px 8px;
  background-color: transparent;
}

.question-prev-title-art {
  z-index: 0;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 40px;
  height: 100%;
  padding-right: 12px;
  border-radius: 8px;
  background-color: #64BFB5;
  transition: 0.2s all;
}

.question-prev:hover .question-prev-title-art {
  width: 100%;
}

.question-prev-more {
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  border: 3px dashed rgb(216, 106, 34, 0.4);
  border-width: 0 3px 3px 3px;
  ;
}

.question-prev-more-main,
.question-prev-more-info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.question-prev-more-main {
  color: black;
}

.question-prev-more-info {}
</style>
