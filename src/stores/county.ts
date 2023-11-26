import { computed, reactive, watch } from 'vue'
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

  async function getCountyData(county: string) {
    const data = countyData[presidentYear + county]

    if (!data) {
      const json = await import(`@/utils/data/${presidentYear}/${county}.json`)
      Object.assign(countyData, { [presidentYear + county]: json.default })
      return json.default
    }

    return data
  }

  return { countyData, getCountyData }
})
