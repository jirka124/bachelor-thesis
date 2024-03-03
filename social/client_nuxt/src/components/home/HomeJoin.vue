<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeJoin",
});
</script>

<template>
  <div id="join">
    <picture>
      <source type="image/webp" srcset="@/assets/identity/icon/icon-256.webp" />
      <source type="image/png" srcset="@/assets/identity/icon/icon-256.png" />
      <img src="@/assets/identity/icon/icon-256.png" alt="company icon" loading="lazy" />
    </picture>
    <p>JOIN THE</p>
    <p>SoConnect</p>
    <p>already</p>
  </div>
</template>

<style scoped>
#join {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
}

#join>picture {
  width: 256px;
}

#join>p {
  transform: translateY(-30px);
}

#join>p:nth-of-type(1) {
  font-size: 26px;
  font-weight: bold;
}

#join>p:nth-of-type(2) {
  font-size: 32px;
  font-weight: bold;
}

#join>p:nth-of-type(3) {
  font-size: 20px;
}
</style>
