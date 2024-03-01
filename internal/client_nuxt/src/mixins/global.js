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
    },
    getDaySchedule(allClasses, date) {
      const dateClasses = []
      for (let i = 0, size = allClasses.length; i < size; i++) {
        const reps = this.getClassRepetitions(allClasses[i])
        for (let j = 0, size2 = reps.length; j < size2; j++) {
          const rep = reps[j]
          if (
            rep.date.getFullYear() === date.getFullYear() &&
            rep.date.getDate() === date.getDate() &&
            rep.date.getMonth() === date.getMonth()
          ) {
            dateClasses.push(rep)
          }
        }
      }

      return dateClasses
    },
    getClassRepetitions(classObj) {
      const cBy = new Date(classObj.cBy)
      const cTill = new Date(classObj.cTill)

      if (classObj.recurrence === 'once') {
        return [{ ...this.deepCopy(classObj), recurrId: 1, date: new Date(Number(cBy)) }]
      } else {
        const reps = []
        const regex = /^e(\d)week$/
        const match = regex.exec(classObj.recurrence)
        if (match) {
          const repetition = match[1]
          let date = new Date(Number(cBy))
          let recurrId = 1
          while (date <= cTill) {
            reps.push({ ...this.deepCopy(classObj), recurrId: recurrId++, date })
            date = new Date(Number(date) + repetition * 7 * 24 * 60 * 60 * 1000)
          }
        }
        return reps
      }
    }
  }
}
