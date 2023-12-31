import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePresidentStore = defineStore('president', () => {
  const presidentYear = ref(2020)

  function setPresidentYear(value: number) {
    presidentYear.value = value
  }

  return { presidentYear, setPresidentYear }
})
