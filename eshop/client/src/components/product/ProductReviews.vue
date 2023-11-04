<script>
import { defineComponent } from "vue";
import ProductReview from "@/components/product/ProductReview.vue";

export default defineComponent({
  name: "ProductReviews",
  components: { ProductReview },
  props: {
    reviews: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    averageStars() {
      if (this.reviews.length < 1) return 3;
      return (
        this.reviews.reduce((total, review) => total + review.stars, 0) /
        this.reviews.length
      );
    },
  },
});
</script>

<template>
  <div id="product-reviews">
    <div id="product-review-total">
      <div id="product-review-total-rate">
        <i class="fa-solid fa-star"></i> {{ averageStars }} / 5
      </div>
      <p id="product-review-total-count">Based on {{ reviews.length }} user reviews</p>
    </div>
    <ProductReview :isEditable="true" />
    <div id="product-reviews-revs"><i class="fa-solid fa-comment"></i> Reviews</div>
    <ProductReview
      v-for="review in reviews"
      :key="review.productReviewId"
      :review="review"
    />
  </div>
</template>

<style scoped>
#product-reviews {
  padding: 4vh 1.6vw 2vh 1.6vw;
}
#product-review-total {
  padding-bottom: 16px;
}
#product-review-total-rate {
  font-size: 26px;
}
#product-review-total-rate > i {
  font-size: 40px;
  color: #c8e6c9;
}
#product-review-total-count {
}
#product-reviews-revs {
  font-size: 18px;
  margin: 16px 0;
}
#product-reviews-revs > i {
  font-size: 20px;
}
</style>
