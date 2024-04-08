import { defineStore } from 'pinia'
const useStore = defineStore('user', {
  state: () => ({
    t: -1,
  }),
  actions: {
    setTime (t: number) {
      this.t = t
    },
  }
})

export default useStore
