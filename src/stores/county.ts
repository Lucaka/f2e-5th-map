import { computed, reactive, ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { usePresidentStore } from './president'

import typeJson from '@/utils/data/2020/高雄市.json'
type CountyJson = typeof typeJson

interface PresidentData {
  [key: string]: CountyJson
}

export const useCountyStore = defineStore('county', () => {
  const { presidentYear } = storeToRefs(usePresidentStore())

  const countyData = reactive<PresidentData>({})
  const currentCounty = ref<string | null>(null)

  watch(
    [presidentYear, currentCounty],
    async (newVal) => {
      getCountyData(newVal[1])
    },
    { immediate: true }
  )

  function setCounty(county: string | null) {
    currentCounty.value = county
  }

  async function getCountyData(county: string | null) {
    if (!county) return (currentCounty.value = null)

    const data = countyData[presidentYear + county]

    if (!data) {
      const json = await import(`@/utils/data/${presidentYear.value}/${county}.json`)
      Object.assign(countyData, { [presidentYear.value + county]: json.default })

      currentCounty.value = county
      return json.default
    }

    return data
  }

  const getCurrentCountyData = computed(() => {
    if (!currentCounty.value) return null
    return countyData[presidentYear.value + currentCounty.value]
  })

  return { countyData, currentCounty, setCounty, getCountyData, getCurrentCountyData }
})
