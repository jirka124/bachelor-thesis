<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterComp",
});
</script>

<template>
  <footer>
    <div id="footer-info">
      Plant Levitate is an abstract company, arranged as a e-commerce for the purpose of
      demonstrating use cases of different frameworks. It is part of the bachelor's thesis
      on such theme by Jiří Žák, student of uhk.cz.
    </div>
    <div id="footer-legal">
      <a href="#">Terms of Use</a>
      <a href="#">Privacy policy</a>
    </div>
    <div id="footer-copy">© 2007 - 2023 Plant Levitate.</div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background-color: #dfdcd8;
}
#footer-info {
  width: calc(100% - 200px);
  padding: 32px 16px;
}
#footer-legal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 200px;
}
#footer-legal > a {
}
#footer-copy {
  text-align: center;
  width: 100%;
  padding: 6px 8px;
  color: #bdbdbd;
  background-color: #757575;
}

@media only screen and (max-width: 500px) {
  #footer-info {
    text-align: center;
    width: 100%;
  }
  #footer-legal {
    width: 100%;
    padding: 8px 0;
  }
}
</style>
