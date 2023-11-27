import { computed, reactive, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { usePresidentStore } from './president'

import typeJson from '@/utils/data/2020/central.json'

type PresidentJson = typeof typeJson

interface PresidentData {
  [key: number]: PresidentJson
}

interface CurrentYearPresidentData {
  name: string
  data: {
    county: string
    count: number
  }[]
}

export const useOverviewStore = defineStore('overview', () => {
  const { presidentYear } = storeToRefs(usePresidentStore())
  const presidentData = reactive<PresidentData>({})

  watch(
    presidentYear,
    async (newVal) => {
      const module = await import(`@/utils/data/${newVal}/central.json`)

      Object.assign(presidentData, { [newVal]: module.default })
    },
    { immediate: true }
  )

  const currentYearVoteData = computed(() => {
    const data = presidentData[presidentYear.value]
    if (!data) return []

    const candidates = data[1] || []

    const candidatesKeys = Object.keys(candidates)
    const candidatesLength = candidatesKeys.length

    const list = data.slice(candidatesLength + 2).map((item) => ({
      ...item,
      Column2: countHandler(item['Column2']),
      Column3: countHandler(item['Column3']),
      Column4: countHandler(item['Column4']),
    }))

    return list
  })

  const currentYearPresidentData = computed(() => {
    const data = presidentData[presidentYear.value]
    if (!data) return []

    const candidates = data[1] || []

    const candidatesKeys = Object.keys(candidates)
    const candidatesLength = candidatesKeys.length

    const list = data
      .slice(candidatesLength + 2)
      .reduce<CurrentYearPresidentData[]>((acc, item) => {
        if (!item) return acc

        if (!acc.length) {
          acc.length = candidatesKeys.length

          candidatesKeys.forEach((key, index) => {
            acc[index] = {
              name: candidates[key as keyof typeof candidates],
              data: []
            }
          })
        }

        candidatesKeys.forEach((key, index) => {
          acc[index].data.push({
            county: item['Column1'] || '-',
            count: countHandler(item[key as keyof typeof item]) || NaN
          })
        })

        return acc
      }, [])

    return list
  })

  const currentYearTotal = computed(() => {
    const data = presidentData[presidentYear.value]
    const defaultData = {
      voteRate: 0,
      sendCount: 0,
      remainCount: 0,
      voteCount: 0,
      validCount: 0,
      invalidCount: 0
    }

    if (!data) return defaultData

    const total = data[4]
    if (!total) return defaultData

    return {
      voteRate: String(total['Column12']).slice(0, 4) + '%',
      sendCount: countHandler(total['Column9']),
      remainCount: countHandler(total['Column10']),
      validCount: countHandler(total['Column5']),
      invalidCount: countHandler(total['Column6']),
      voteCount: countHandler(total['Column7'])
    }
  })

  function countHandler(count: string | number | undefined): number {
    if (!count) return 0

    if (typeof count === 'number') return count

    return Number(count.replace(/,/g, ''))
  }

  return { presidentData, currentYearVoteData, currentYearPresidentData, currentYearTotal }
})
