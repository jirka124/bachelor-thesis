<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useGuestStore } from "@/stores/guest";
import QuestionPreview from "@/components/QuestionPreview.vue";

export default defineComponent({
  name: "SearchView",
  components: { QuestionPreview },
  computed: {
    ...mapStores(useGuestStore),
    posts() {
      return this.guestStore.searchedPosts;
    }
  },
  methods: {
    async fetchSearchPosts() {
      const srchFor = this.$route.query.srchFor || null;
      if (srchFor === null) return;

      // fetch searched posts
      let r;
      try {
        r = (await this.$api.post("general/view-search-csr", { srchFor })).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("posts"))
          this.guestStore.setSearchedPosts(r.result.posts);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.fetchSearchPosts();
  }
});
</script>

<template>
  <div id="search">
    <div id="search-info">
      <b>Showing {{ posts.length }} results matching the search: </b>
      <p>{{ this.$route.query.srchFor || "" }}</p>
    </div>
    <div id="search-results">
      <QuestionPreview v-for="post in posts" :key="post.postId" :post="post" />
    </div>
  </div>
</template>

<style scoped>
#search {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

#search-info {}

#search-info>b {
  font-size: 20px;
}

#search-info>p {
  font-size: 18px;
}

#search-results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
</style>
