<script>
import { defineComponent } from "vue";
import PostComp from "@/components/app/PostComp.vue";

export default defineComponent({
  name: "ViewPostView",
  components: { PostComp },
});
</script>

<template>
  <div id="view-post">
    <PostComp />
  </div>
</template>

<style scoped>
#view-post {
  padding: 16px;
  min-height: 100vh;
}
</style>
