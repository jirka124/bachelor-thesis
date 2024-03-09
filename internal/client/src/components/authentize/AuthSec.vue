<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthSec",
});
</script>

<template>
  <div id="auth-sec">
    <div id="auth-sec-act">
      <RouterView />
    </div>
    <picture id="auth-sec-back">
      <source type="image/webp" srcset="@/assets/school-illustration.webp" media="(min-width: 500px)" width="640"
        height="384" />
      <source type="image/png" srcset="@/assets/school-illustration.png" media="(min-width: 500px)" width="640"
        height="384" />
      <img src="data:," alt="school image" width="640" height="384" loading="lazy" />
    </picture>
  </div>
</template>

<style scoped>
#auth-sec {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
}

#auth-sec-act {
  width: 500px;
}

#auth-sec-back {
  width: calc(100% - 500px);
  overflow: hidden;
}

#auth-sec-back>img {
  object-fit: cover;
  height: 100%;
}

@media only screen and (max-width: 500px) {
  #auth-sec-back {
    display: none;
  }
}
</style>
