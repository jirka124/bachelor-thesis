<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeWelcome",
});
</script>

<template>
  <div id="welcome">
    <div id="welcome-pic">
      <picture>
        <source type="image/webp" srcset="@/assets/identity/logo/logo-256.webp" width="256" height="256" />
        <source type="image/png" srcset="@/assets/identity/logo/logo-256.png" width="256" height="256" />
        <img src="@/assets/identity/logo/logo-256.png" alt="company logo" width="256" height="256" loading="lazy" />
      </picture>
    </div>
    <div id="welcome-text">
      <div id="welcome-text-welc">Welcome to</div>
      <h1 id="welcome-text-name">Plant Levitate</h1>
      <hr id="welcome-text-line" />
      <p id="welcome-text-info">
        The NO. 1 in industry, manufacturing and selling the "Levitating Plant Pots" since
        the 1992's.
      </p>
      <RouterLink to="/stock"><button class="btn-1">SHOP</button></RouterLink>
    </div>
  </div>
</template>

<style scoped>
#welcome {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 8px;
  background-color: #ebfdec;
}

#welcome-pic {}

#welcome-pic>picture {
  width: 300px;
}

#welcome-pic>picture>img {
  width: 100%;
}

#welcome-text {
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  row-gap: 4px;
  min-width: 300px;
  max-width: 600px;
}

#welcome-text-welc {
  font-size: 18px;
  color: #979797;
}

#welcome-text-name {
  font-size: 30px;
}

#welcome-text-line {
  width: 60px;
  height: 3px;
  background-color: #757575;
}

#welcome-text-info {
  font-size: 18px;
}

@media only screen and (max-width: 920px) {
  #welcome-pic {
    order: 2;
  }

  #welcome-pic>picture {
    width: 200px;
  }

  #welcome-text {
    order: 1;
  }
}
</style>
