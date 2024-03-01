<script>
import { defineComponent } from "vue";
import { mapActions } from "pinia";
import { useAppStore } from "@/stores/app";

export default defineComponent({
  name: "ProductReview",
  props: {
    isEditable: {
      type: Boolean,
      default: false,
    },
    review: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      MIN_STAR_COUNT: 1,
      MAX_STAR_COUNT: 5,
      starCount: 3,
      reviewInput: "",
    };
  },
  computed: {
    filledStars() {
      if (this.isEditable)
        return new Array(this.starCount).fill(null).map((x, i) => i + 1);
      return new Array(this.review.stars).fill(null).map((x, i) => i + 1);
    },
    unfilledStars() {
      if (this.isEditable)
        return new Array(this.MAX_STAR_COUNT - this.starCount)
          .fill(null)
          .map((x, i) => i + this.starCount + 1);
      return new Array(this.MAX_STAR_COUNT - this.review.stars)
        .fill(null)
        .map((x, i) => i + this.review.stars + 1);
    },
  },
  methods: {
    ...mapActions(useAppStore, ["prependProductReview"]),
    setStars(starCount) {
      this.starCount = starCount;
    },
    starDynamicStyle(fillState) {
      const style = {};
      style.color = fillState === "fill" ? "#c8e6c9" : (style.color = "#bdbdbd");
      if (this.isEditable) style.cursor = "pointer";
      return style;
    },
    async leaveReview() {
      // upload a new review on product
      let r;
      try {
        r = (
          await this.$api.post("general/product-add-review", {
            productId: this.$route.params.productId,
            stars: this.starCount,
            text: this.reviewInput,
          })
        ).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("addedReview"))
          this.prependProductReview(r.result.addedReview);

        this.starCount = 3;
        this.reviewInput = "";
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <div class="product-review" v-if="review || isEditable">
    <div class="product-review-top">
      <div class="product-review-top-user"><i class="fa-solid fa-user"></i></div>
      <div class="product-review-top-text">
        <template v-if="!isEditable">
          {{ review.text }}
        </template>
        <textarea
          class="scroll"
          placeholder="Write a review on product..."
          v-model="reviewInput"
          v-if="isEditable"
        ></textarea>
      </div>
    </div>
    <div class="product-review-bot">
      <div class="product-review-bot-stars">
        <i
          class="fa-solid fa-star"
          :style="starDynamicStyle('fill')"
          v-for="x in filledStars"
          :key="x"
          @click="setStars(x)"
        ></i>
        <i
          class="fa-solid fa-star"
          :style="starDynamicStyle('unfill')"
          v-for="x in unfilledStars"
          :key="x"
          @click="setStars(x)"
        ></i>
      </div>
      <button class="btn-2" v-if="isEditable" @click="leaveReview">Review</button>
    </div>
  </div>
</template>

<style scoped>
.product-review {
  padding: 6px 0;
}
.product-review-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1vh 1vw;
}
.product-review-top-user {
}
.product-review-top-user > i {
  font-size: 40px;
}
.product-review-top-text {
  background-color: #ebfdec;
  width: 300px;
  padding: 8px;
  border-radius: 16px;
}
.product-review-top-text > textarea {
  width: 100%;
  height: 100px;
  background-color: transparent;
  border: none;
  outline: none;
  resize: vertical;
}
.product-review-bot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  max-width: 350px;
  padding: 1vh 0;
}
.product-review-bot-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.product-review-bot-stars > i {
  font-size: 18px;
}
.product-review-bot > button {
  font-size: 17px;
  padding: 0px 28px;
}
</style>
