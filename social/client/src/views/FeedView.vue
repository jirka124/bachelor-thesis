<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useUserStore } from "@/stores/user";
import PostComp from "@/components/app/PostComp.vue";

export default defineComponent({
  name: "FeedView",
  components: { PostComp },
  computed: {
    ...mapStores(useUserStore),
    posts() {
      return this.userStore.feedPosts || []
    }
  },
  methods: {
    goToCreatePost() {
      if (this.userStore.isLogged) this.$router.push({ name: "create-post" });
      else this.$router.push({ name: "login" });
    },
    async fetchFeed() {
      let r;
      try {
        r = (await this.$api.post("user/view-feed-csr")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("posts")) {
          this.userStore.setFeedPosts(r.result.posts, r.result.likes, r.result.likeCounts, r.result.replyCounts);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
  mounted() {
    this.fetchFeed();
  },
});
</script>

<template>
  <div id="feed">
    <div id="feed-wanna-post">
      <p>Looking to create a post?</p>
      <button @click="goToCreatePost" class="btn-1">Create post!</button>
    </div>
    <div id="feed-posts">
      <PostComp v-for="post in posts" :key="post.postId" :post="post" />
    </div>
  </div>
</template>

<style scoped>
#feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  min-height: 100vh;
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
