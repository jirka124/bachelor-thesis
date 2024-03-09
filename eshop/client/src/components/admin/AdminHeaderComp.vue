<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminHeaderComp",
});
</script>

<template>
  <header>
    <div>Plant</div>
    <picture>
      <source
        type="image/webp"
        srcset="@/assets/identity/icon/icon-64.webp"
        width="64"
        height="64"
      />
      <source
        type="image/png"
        srcset="@/assets/identity/icon/icon-64.png"
        width="64"
        height="64"
      />
      <img
        src="@/assets/identity/icon/icon-64.png"
        alt="company icon"
        width="64"
        height="64"
        loading="lazy"
      />
    </picture>
    <div>Levitate</div>
  </header>
</template>

<style scoped>
header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px;
  color: #ebfdec;
  background-color: #81c681;
  box-shadow: 0px 2px 4px 0px rgba(100, 100, 100, 0.5);
}

header > div {
  font-size: 32px;
}

header > picture {
  width: 64px;
  height: 64px;
}
</style>
