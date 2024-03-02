<script>
import { defineComponent } from "vue";
import { api } from "@/plugins/02.axios.js";
import { mapStores } from "pinia";
import { useGuestStore } from "@/stores/guest";
import QuestionReply from "@/components/QuestionReply.vue";

export default defineComponent({
  name: "DiscussionView",
  components: { QuestionReply },
  async setup() {
    const nuxtApp = useNuxtApp();
    const guestStore = useGuestStore();
    const postId = useRoute().params.postId || null;

    const fetchPageSSR = async (postId) => {
      // fetch post details (indexed)
      let r;
      try {
        const reqBody = { postId };
        if (process.server) reqBody.path = useRoute().fullPath;

        // avoid double fetch, while preserving fully live data
        if (process.server && !nuxtApp.isHydrating)
          clearNuxtData("general/view-discussion-ssr");

        const { data, error } = await useAsyncData(
          "general/view-discussion-ssr",
          () => api.post("general/view-discussion-ssr", reqBody),
          { pick: ["data"] }
        );
        r = data._value.data;

        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("post")) guestStore.setViewedPost(r.result.post);
      } catch (error) {
        console.error(error);
      }

      /*
      // fetch post details
      const postId = this.$route.params.postId || null;
      if (postId === null) return;

      const reqBody = { postId };
      if (this.isServer || true) reqBody.path = this.$route.fullPath;

      let r;
      try {
        r = (await api.post("general/view-discussion-ssr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("post"))
          this.guestStore.setViewedPost(r.result.post);
      } catch (error) {
        console.error(error);
      }
      */
    };

    await fetchPageSSR(postId);
  },
  data() {
    return {
      createLock: false,
      replyVal: "",
      nameVal: "",
    }
  },
  computed: {
    ...mapStores(useGuestStore),
    post() {
      return this.guestStore.viewedPost;
    },
    postReplies() {
      return this.post ? this.post.replies || [] : []
    }
  },
  methods: {
    async fetchViewedPostSSR() {
      // fetch post details
      const postId = this.$route.params.postId || null;
      if (postId === null) return;

      const reqBody = { postId };
      if (this.isServer || true) reqBody.path = this.$route.fullPath;

      let r;
      try {
        r = (await api.post("general/view-discussion-ssr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("post"))
          this.guestStore.setViewedPost(r.result.post);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchViewedPostCSR() {
      const postId = this.$route.params.postId || null;
      if (postId === null) return;

      const reqBody = { postId };

      let r;
      try {
        r = (await api.post("general/view-discussion-csr", reqBody)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("post"))
          this.guestStore.alterViewedPost(r.result.post);
      } catch (error) {
        console.error(error);
      }
    },
    async createReply() {
      if (this.createLock) return;
      this.createLock = true;

      const postId = this.$route.params.postId || null;
      if (postId === null) return;

      let r;
      try {
        r = (await this.$api.post("general/create-reply", {
          postId,
          replyVal: this.replyVal,
          nameVal: this.nameVal
        })).data;

        if (r.reqState !== null) console.log(r.reqState);
        else {
          this.guestStore.addViewedReply(r.result.replyObj);
          this.replyVal = this.nameVal = "";
        }
      } catch (error) {
        console.error(error);
      }

      this.createLock = false;
    }
  },
  async mounted() {
    // this.fetchViewedPostSSR();
    this.fetchViewedPostCSR();
  },
});
</script>

<template>
  <div id="discuss">
    <div id="discuss-meta">
      <p>{{ post ? new Date(post.date).toLocaleDateString() : "ERROR" }}</p>
      <b>{{ post ? post.name : "ERROR" }}</b>
    </div>
    <h1 id="discuss-title">{{ post ? post.title : "ERROR" }}</h1>
    <p id="discuss-question">
      {{ post ? post.description : "ERROR" }}
    </p>
    <div id="discuss-echos">
      <p>{{ post ? post.viewCount || 0 : 0 }} views</p>
      <p>{{ post ? post.replyCount || 0 : 0 }} replies</p>
    </div>
    <p id="discuss-reply-title">Do you want to reply?</p>
    <div id="discuss-leave-reply">
      <textarea v-model="replyVal" placeholder="The answer you would like to leave" class="in"></textarea>
      <input v-model="nameVal" type="text" placeholder="Your username" class="in">
      <button @click="createReply" class="btn-1">Submit</button>
    </div>
    <div id="discuss-replies">
      <QuestionReply v-for="reply in postReplies" :key="reply.postReplyId" :reply="reply" />
    </div>
  </div>
</template>

<style scoped>
#discuss {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

#discuss-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

#discuss-meta>p {}

#discuss-title {
  font-size: 28px;
}

#discuss-question {
  font-size: 18px;
}

#discuss-echos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

#discuss-echos>p {}

#discuss-reply-title {
  font-size: 20px;
  padding: 10px 0;
}

#discuss-leave-reply {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

#discuss-leave-reply>textarea {
  height: 140px;
}

#discuss-leave-reply>input {}

#discuss-leave-reply>button {}

#discuss-replies {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}
</style>
