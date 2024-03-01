export default {
  inject: ["isClient", "isServer"],
  methods: {
    changeQueryParam(paramName, paramValue) {
      const query = JSON.parse(JSON.stringify(this.$route.query));
      query[paramName] = paramValue;
      this.$router.replace({ query });
    },
    delay(delay) {
      return new Promise((resolve) => {
        this.fetchOptimizerInst = setTimeout(() => {
          resolve();
        }, delay);
      });
    },
  },
};
