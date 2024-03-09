<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeBanner",
});
</script>

<template>
  <div id="banner">
    <b>Elevate your room</b>
    <b>with a bit of levitation</b>
    <picture>
      <source type="image/webp" srcset="@/assets/triple-pot-512.webp" media="(max-width: 512px)" width="512"
        height="640" />
      <source type="image/webp" srcset="@/assets/triple-pot-1024.webp" media="(max-width: 1024px)" width="1024"
        height="640" />
      <source type="image/webp" srcset="@/assets/triple-pot-2048.webp" media="(min-width: 2048px)" width="2048"
        height="1024" />
      <source type="image/jpeg" srcset="@/assets/triple-pot-512.jpg" media="(max-width: 512px)" width="512"
        height="640" />
      <source type="image/jpeg" srcset="@/assets/triple-pot-1024.jpg" media="(max-width: 1024px)" width="1024"
        height="640" />
      <source type="image/jpeg" srcset="@/assets/triple-pot-2048.jpg" media="(min-width: 2048px)" width="2048"
        height="1024" />
      <img src="@/assets/triple-pot-1024.jpg" alt="design pots" width="1028" height="640" loading="lazy" />
    </picture>
  </div>
</template>

<style scoped>
#banner {}

#banner>picture>img {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
}

#banner b {
  position: absolute;
}

#banner b:nth-of-type(1) {
  font-size: 30px;
  top: 90px;
  right: 10%;
}

#banner b:nth-of-type(2) {
  font-size: 24px;
  top: 150px;
  right: 15%;
}
</style>
