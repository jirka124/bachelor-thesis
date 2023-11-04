class Util {
    UTCtoLocal (date) {  // self-explanatory
      // FROM... Wed Jun 23 2021 12:14:11 GMT+0200 (GMT+02:00)   ("GMT time")
      // TO...   Wed Jun 23 2021 14:14:08 GMT+0200 (GMT+02:00)   (real local time)
      return new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset()))
    }
    localtoUTC (date) {  // self-explanatory
      // FROM... Wed Jun 23 2021 10:14:11 GMT+0200 (GMT+02:00)  (real local time)
      // TO...   Wed Jun 23 2021 08:14:08 GMT+0200 (GMT+02:00)  ("GMT time")
      return new Date(date.setMinutes(date.getMinutes() + date.getTimezoneOffset()))
    }
    isDefined (variable) { // check whether argument is/isn't defined
      return typeof variable !== 'undefined'
    }
    isEmptyObj (obj) { // check whether argument is/isn't empty object
      if(!obj) return true;
      return Object.keys(obj).length === 0 && obj.constructor === Object
    }
    isEmptyArr (arr) { // check whether argument is/isn't empty array
      return Array.isArray(arr) && !arr.length
    }
    isValidDate (date) { // check whether argument is/isn't valid date
      return date instanceof Date && !isNaN(date)
    }
    dateDTB (date) { // return string containing ISO date ready for database storing
      return date.toISOString().slice(0, -1)
    }
    randomMax (max) { // return whole number in range <0, max>
      return this.randomMinMax(0, max)
    }
    randomMinMax (min, max) { // return whole number in range <min, max>
      return Math.floor(Math.random() * (max - min + 1) ) + min
    }
  }
  
  module.exports = new Util()