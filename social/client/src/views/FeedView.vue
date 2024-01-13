<script>
import { defineComponent } from "vue";
import PostComp from "@/components/app/PostComp.vue";

export default defineComponent({
  name: "FeedView",
  components: { PostComp },
});
</script>

<template>
  <div id="feed">
    <div id="feed-wanna-post">
      <p>Looking to create a post?</p>
      <button class="btn-1">Create post!</button>
    </div>
    <div id="feed-posts">
      <PostComp v-for="i in [1, 2]" :key="i" />
    </div>
  </div>
</template>

<style scoped>
#feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

#feed-wanna-post {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

#feed-wanna-post>p {
  font-size: 20px;
}

#feed-posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
