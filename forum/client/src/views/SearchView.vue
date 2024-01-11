<script>
import { defineComponent } from "vue";
import QuestionPreview from "@/components/QuestionPreview.vue";

export default defineComponent({
  name: "SearchView",
  components: { QuestionPreview },
});
</script>

<template>
  <div id="search">
    <div id="search-info">
      <b>Showing 10 of 55 results matching the search: </b>
      <p>Welcome to the jungle</p>
    </div>
    <div id="search-results">
      <QuestionPreview v-for="i in new Array(20).fill(null).map(i => i)" :key="i" />
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
