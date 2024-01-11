<script>
import { defineComponent } from "vue";
import QuestionReply from "@/components/QuestionReply.vue";

export default defineComponent({
  name: "DiscussionView",
  components: { QuestionReply }
});
</script>

<template>
  <div id="discuss">
    <div id="discuss-meta">
      <p>20.10.2001</p>
      <b>Julius Ceasar</b>
    </div>
    <h1 id="discuss-title">The Title of the question</h1>
    <p id="discuss-question">
      It goes without saying that a wide action of a number of the critical thinking provides benefit from The
      Availability of Promising Capacity (Alfonzo Hales in The Book of the Functional Programming)
      To be quite frank, in the context of deep analysis enforces the overall effect of this relational approach. This can
      eventually cause certain issues.
      Consequently, the unification of the consequential risks discards the principle of the preliminary action plan.
    </p>
    <div id="discuss-echos">
      <p>104 views</p>
      <p>14 replies</p>
    </div>
    <p id="discuss-reply-title">Do you want to reply?</p>
    <div id="discuss-leave-reply">
      <textarea placeholder="The answer you would like to leave" class="in"></textarea>
      <input type="text" placeholder="Your username" class="in">
      <button class="btn-1">Submit</button>
    </div>
    <div id="discuss-replies">
      <QuestionReply v-for="i in new Array(8).fill(null).map(i => i)" :key="i" />
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
