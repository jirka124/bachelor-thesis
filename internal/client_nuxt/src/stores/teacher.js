import { defineStore } from 'pinia'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    isLoggedAsTeacher: false,
    teacherId: null,
    teacherName: null,
    allTeacherClasses: [],
    editedClass: {},
    editedClassAttends: [],
    editedAttendant: {},
    writenClass: {},
    writenClassAttends: [],
    writenClassAttendsPresent: [],
    readClass: {},
    readClassAttends: [],
    readClassAttendsPresent: []
  }),
  getters: {},
  actions: {
    setIsLoggedAsTeacher(isLogged) {
      this.isLoggedAsTeacher = isLogged
    },
    setTeacherId(teacherId) {
      this.teacherId = teacherId
    },
    setTeacherName(teacherName) {
      this.teacherName = teacherName
    },
    setAllTeacherClasses(classes) {
      this.allTeacherClasses = classes
    },
    setEditedClass(classObj) {
      this.editedClass = classObj
    },
    setEditedClassAttends(attendants) {
      this.editedClassAttends = attendants
    },
    setEditedAttendant(attendantObj) {
      this.editedAttendant = attendantObj
    },
    setWritenClass(classObj) {
      this.writenClass = classObj
    },
    setWritenClassAttends(attendants) {
      this.writenClassAttends = attendants
    },
    setWritenClassAttendsPresent(presence) {
      this.writenClassAttendsPresent = presence
    },
    addWritenClassAttendsPresent(newPresences) {
      newPresences.map((np) => {
        const ind = this.writenClassAttendsPresent.findIndex(
          (ap) => ap.attendantId === np.attendantId
        )
        if (ind < 0) this.writenClassAttendsPresent.push(np)
      })
    },
    delWritenClassAttendsPresent(oldPresences) {
      oldPresences.map((np) => {
        const ind = this.writenClassAttendsPresent.findIndex(
          (ap) => ap.attendantId === np.attendantId
        )
        if (ind > -1) this.writenClassAttendsPresent.splice(ind, 1)
      })
    },
    setReadClass(classObj) {
      this.readClass = classObj
    },
    setReadClassAttends(attendants) {
      this.readClassAttends = attendants
    },
    setReadClassAttendsPresent(presence) {
      this.readClassAttendsPresent = presence
    }
  }
})
