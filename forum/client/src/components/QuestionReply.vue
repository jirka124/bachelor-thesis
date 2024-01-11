<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "QuestionReply",
  props: {
    reply: {
      type: Object,
      default: null
    }
  }
});
</script>

<template>
  <div class="question-reply">
    <p class="question-reply-title">
      {{ reply ? reply.reply : "ERROR" }}
    </p>
    <div class="question-reply-more">
      <p>{{ reply ? new Date(reply.date).toLocaleDateString() : "ERROR" }}</p>
      <p>{{ reply ? reply.name : "ERROR" }}</p>
    </div>
  </div>
</template>

<style scoped>
.question-reply {
  flex: 1;
  min-width: 280px;
  max-width: 600px;
  padding: 8px 8px 0 8px;
  border-radius: 8px;
  background-color: #F7CDB2;
  box-shadow: 0px 2px 4px 0px rgba(100, 100, 100, 0.5);
}

.question-reply-title {
  color: black;
}

.question-reply-more {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
  transform: translateY(15%);
}

.question-reply-more>p {
  padding: 6px;
  border-radius: 8px;
  color: black;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(100, 100, 100, 0.5);
}
</style>
