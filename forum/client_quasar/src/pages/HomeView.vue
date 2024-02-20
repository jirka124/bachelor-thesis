<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useGuestStore } from "@/stores/guest";
import HomeBanner from "@/components/home/HomeBanner.vue";
import QuestionPreview from "@/components/QuestionPreview.vue";

export default defineComponent({
  name: "HomeView",
  components: { HomeBanner, QuestionPreview },
  computed: {
    ...mapStores(useGuestStore),
    posts() {
      return this.guestStore.trendingPosts;
    }
  },
  methods: {
    goToCreate() {
      this.$router.push({ name: "ask-guest" });
    },
    async fetchTrendingPosts() {
      // fetch treding now posts
      let r;
      try {
        r = (await this.$api.post("general/view-home-csr")).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("posts"))
          this.guestStore.setTrendingPosts(r.result.posts, r.result.views, r.result.replies);
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    this.fetchTrendingPosts();
  },
});
</script>

<template>
  <div id="home">
    <HomeBanner />
    <div id="home-act">
      <h1 id="home-act-call">Looking for own question to be answered?</h1>
      <button @click="goToCreate" id="home-act-now" class="btn-1">Ask Question</button>
    </div>
    <p id="home-welcome">
      Welcome to Mingle debate forum, feel free to go through any of user questions and answer them if you know the
      answer or have any valuable input on topic. Or start by asking a question on your own, whenever you need help Mingle
      debate is here for you.
    </p>
    <div id="home-trending">
      <QuestionPreview v-for="post in posts" :key="post.postId" :post="post" />
    </div>
  </div>
</template>

<style scoped>
#home {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

#home-act {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  width: 100%;
  padding: 8px 0;
}

#home-act-call {
  font-size: 30px;
  color: black;
}

#home-act-now {}

#home-welcome {
  font-size: 18px;
}

#home-trending {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 32px 0;
}
</style>
