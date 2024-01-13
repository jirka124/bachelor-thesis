<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterComp",
});
</script>

<template>
  <footer>
    <div id="footer-info">
      SoConnect is an abstract social media, arranged as a social medie app for the purpose of demonstrating use cases of
      different frameworks. It is part of the bachelor's thesis on such theme by Jiří Žák, student of uhk.cz.
    </div>
    <div id="footer-legal">
      <a href="#">Terms of Use</a>
      <a href="#">Privacy policy</a>
    </div>
    <div id="footer-copy">©2023 SoConnect</div>
  </footer>
</template>

<style scoped>
footer {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  background-color: #8CBCDF;
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

#footer-legal>a {}

#footer-copy {
  text-align: center;
  width: 100%;
  padding: 6px 8px;
  color: #bdbdbd;
  background-color: #192E46;
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
