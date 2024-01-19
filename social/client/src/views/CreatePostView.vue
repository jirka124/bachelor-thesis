<script>
import { defineComponent } from "vue";
import PostComp from "@/components/app/PostComp.vue";

export default defineComponent({
  name: "CreatePostView",
  components: { PostComp },
  data() {
    return {
      contentVal: ""
    }
  },
  methods: {
    goToFeed() {
      this.$router.push({ name: "feed" })
    },
    async createPost() {
      let r;
      try {
        r = (await this.$api.post("user/create-post", { contentVal: this.contentVal })).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.goToFeed();
      } catch (error) {
        console.error(error);
      }
    },
  }
});
</script>

<template>
  <div id="create-post">
    <PostComp :readonly="false" v-model:modelValue="contentVal" />
    <div id="create-post-act">
      <button @click="createPost" class="btn-1">POST</button>
      <button @click="goToFeed" class="btn-1">cancel</button>
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
