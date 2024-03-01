<script>
import { defineComponent } from "vue";
import AuthSec from "@/components/authentize/AuthSec.vue";
import FooterComp from "@/components/FooterComp.vue";

export default defineComponent({
  name: "AuthentizeLayout",
  components: { AuthSec, FooterComp }
});
</script>

<template>
  <div id="cont">
    <AuthSec />
    <FooterComp />
  </div>
</template>
