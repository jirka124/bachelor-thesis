export default {
  inject: ['isClient', 'isServer'],
  methods: {
    changeQueryParam(paramName, paramValue) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query[paramName] = paramValue
      this.$router.replace({ query })
    },
    delay(delay) {
      return new Promise((resolve) => {
        this.fetchOptimizerInst = setTimeout(() => {
          resolve()
        }, delay)
      })
    },
    deepCopy(source) {
      return JSON.parse(JSON.stringify(source))
    },
    localAsUTC(date = new Date()) {
      /* returns @param date (local date object) as ISO UTC string keeping the local time information */
      return new Date(date - date.getTimezoneOffset() * 60 * 1000).toISOString()
    }
  }
}
