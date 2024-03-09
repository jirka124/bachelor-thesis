<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeFindUs",
});
</script>

<template>
  <div id="home-find">
    <div id="home-find-caption" class="home-caption">
      ❖ <h2>Where to find us</h2>
    </div>
    <div id="home-find-where">
      <div id="home-find-where-logo">
        <picture class="team-item-avatar">
          <source type="image/webp" srcset="@/assets/identity/logo/logo-512.webp" width="512" height="522" />
          <source type="image/png" srcset="@/assets/identity/logo/logo-512.png" width="512" height="522" />
          <img :src="`@/assets/identity/logo/logo-512.png`" alt="Company logo" width="512" height="522"
            loading="lazy" />
        </picture>
      </div>
      <div id="home-find-where-info">
        <p>The Unity Vanguards Are to be found All over the United kindoms, but their residence is located in streets of
          london.</p>
        <p>Frampton St, London NW8 8LH, United Kingdom</p>
        <p>+44 123 456 7891</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#home-find {
  padding: 16px;
}

#home-find-where {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px 0;
}

#home-find-where-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 256px;
  height: 256px;
}

#home-find-where-logo>picture {
  width: 90%;
}

#home-find-where-logo>picture>img {
  width: 100%;
}

#home-find-where-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 12px;
  width: calc(100% - calc(256px + 16px));
  padding: 0 6px;
}

@media only screen and (max-width: 800px) {
  #home-find-where-logo {
    width: 100%;
    height: auto;
  }

  #home-find-where-logo>picture {
    width: 60%;
  }

  #home-find-where-info {
    width: 100%;
  }
}
</style>
