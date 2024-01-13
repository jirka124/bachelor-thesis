<script>
import { defineComponent } from "vue";
import PostComp from "@/components/app/PostComp.vue";

export default defineComponent({
  name: "CreatePostView",
  components: { PostComp },
});
</script>

<template>
  <div id="create-post">
    <PostComp />
    <div id="create-post-act">
      <button class="btn-1">POST</button>
      <button class="btn-1">cancel</button>
    </div>
  </div>
</template>

<style scoped>
#create-post {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  min-height: 100vh;
}

#create-post-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
