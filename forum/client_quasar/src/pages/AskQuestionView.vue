<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AskQuestionView",
  data() {
    return {
      createLock: false,
      titleVal: "",
      descriptionVal: "",
      nameVal: "",
      hintToggles: [false, false, false]
    }
  },
  methods: {
    goToHome() {
      this.$router.push({ name: "home-guest" });
    },
    async createPost() {
      if (this.createLock) return;
      this.createLock = true;

      let r;
      try {
        r = (await this.$api.post("general/create-post", {
          titleVal: this.titleVal,
          descriptionVal: this.descriptionVal,
          nameVal: this.nameVal
        })).data;

        if (r.reqState !== null) console.log(r.reqState);
        else this.$router.push({ name: "discuss-guest", params: { postId: r.result.postId } })
      } catch (error) {
        console.error(error);
      }

      this.createLock = false;
    }
  },
});
</script>

<template>
  <div id="ask">
    <div id="ask-act-call">Asking is easy, it takes just question and a few clicks.</div>
    <div class="ask-in-group">
      <input v-model="titleVal" maxlength="128" type="text" placeholder="The title of your question" class="in">
      <button @click="hintToggles[0] = !hintToggles[0]"><i class="fa-solid fa-question"></i></button>
    </div>
    <div v-show="hintToggles[0]" class="ask-hint">
      The title of your question should be 1 sentece long and interesting enough to catch the readers attention, also
      it should include the most important words as it will be rendered with the highest priority due to a rest of page
      content.
    </div>
    <div class="ask-in-group">
      <textarea v-model="descriptionVal" maxlength="1000" rows="6" placeholder="The whole question" class="in"></textarea>
      <button @click="hintToggles[1] = !hintToggles[1]"><i class="fa-solid fa-question"></i></button>
    </div>
    <div v-show="hintToggles[1]" class="ask-hint">
      The question itself should contain all of the user's intention, but be careful with very long question as it may
      leed to the lose of interest from the reader's perspective. It is rendered with hight priority.
    </div>
    <div class="ask-in-group">
      <input v-model="nameVal" maxlength="32" type="text" placeholder="Your username" class="in">
      <button @click="hintToggles[2] = !hintToggles[2]"><i class="fa-solid fa-question"></i></button>
    </div>
    <div v-show="hintToggles[2]" class="ask-hint">
      Your username may be anything that compiles with the terms of use for this service, please take not that no username
      is reserved and thus questions made by same username may not be asked be the same person.
    </div>
    <div>
      <button @click="createPost" class="btn-1">Ask Question</button>
      <button @click="goToHome" class="btn-2">Have changed my mind, don't want to ask</button>
    </div>
  </div>
</template>

<style scoped>
#ask {
  display: flex;
  flex-direction: column;
  row-gap: 12px;
}

#ask-act-call {
  font-size: 20px;
  color: black;
}

.ask-in-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ask-in-group>.in {
  flex-grow: 1;
}

.ask-in-group>button {
  width: 32px;
  height: 32px;
  border: none;
  color: #EA7F39;
  background-color: #F7CDB2;
  cursor: pointer;
}

.ask-in-group>button:hover {
  background-color: #f0ba99;
}

.ask-in-group>button>i {}

.ask-hint {
  padding: 8px;
  border-radius: 8px;
  background-color: #F7CDB2;
}
</style>
