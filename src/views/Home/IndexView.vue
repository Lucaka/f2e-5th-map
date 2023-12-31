<script setup lang="ts">
import { useOverviewStore } from '@/stores/overview'
import { ref, computed } from 'vue'
import UtilIcon from '@/components/utils/icon/UtilIcon.vue'
import OverviewPies from '@/views/Home/components/OverviewPies.vue'
import OverviewBar from '@/views/Home/components/OverviewBar.vue'

const search = ref<null | string>(null)

const useOverview = useOverviewStore()
const colors = ['#B4A073', '#08C0BE', '#E756B8']
const presidentData = computed(() => {
  return useOverview.currentYearPresidentData
    .map((president, index) => {
      return {
        name: president.name,
        voteCount: president.data.map((data) => data.count).reduce((a, b) => a + b, 0),
        color: colors[index]
      }
    })
    .sort((a, b) => b.voteCount - a.voteCount)
})

const overview = computed(() => {
  return [
    {
      title: '投票率',
      value: useOverview.currentYearTotal.voteRate
    },
    {
      title: '投票數',
      value: numberFormat(useOverview.currentYearTotal.voteCount)
    },
    {
      title: '有效票數',
      value: numberFormat(useOverview.currentYearTotal.validCount)
    },
    {
      title: '無效票數',
      value: numberFormat(useOverview.currentYearTotal.invalidCount)
    }
  ]
})

const overviewPiesData = computed(() => {
  const { sendCount, remainCount } = useOverview.currentYearTotal
  return [sendCount, remainCount]
})

function numberFormat(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-12 gap-4 lg:gap-10 mt-12 mb-14">
      <button
        class="tools col-span-4 lg:col-span-2"
        :class="{ active: search === null }"
        @click="search = null"
      >
        全國
      </button>
      <select v-model="search" class="tools col-span-4 lg:col-span-2">
        <option :value="null">縣市</option>
        <option value="高雄市">高雄市</option>
      </select>
      <select class="tools col-span-4 lg:col-span-2">
        <option :value="null">鄉鎮</option>
      </select>

      <div class="col-span-12 lg:col-span-6 relative">
        <input class="tools w-full !text-left !pl-9" type="text" />
        <UtilIcon name="Search" class="absolute w-4 top-1/2 left-4 transform -translate-y-1/2" />
      </div>
    </div>

    <div>
      <ul class="lg:flex mb-14">
        <li
          v-for="(data, index) in presidentData"
          :key="index"
          class="text-white py-1 px-4 min-w-[10rem]"
          :style="{
            width: (data.voteCount / useOverview.currentYearTotal.validCount) * 100 + '%',
            background: `linear-gradient(90deg, ${data.color} 0%, ${data.color}55 100%)`
          }"
        >
          <p>
            {{ data.name }}
          </p>
          <p>{{ numberFormat(data.voteCount) }}票</p>
        </li>
      </ul>
    </div>

    <div class="flex justify-between">
      <figure>
        <figcaption class="text-3xl text-[#fff3]">WE LOVE TW</figcaption>
        <img src="@/assets/img/uranus3.png" alt="WE LOVE TW" />
      </figure>

      <div class="text-white">
        <h2 class="text-center text-3xl mb-10">選舉概況</h2>

        <div class="flex gap-10 items-center">
          <OverviewPies :data="overviewPiesData" />

          <ul class="flex flex-col gap-2 text-2xl">
            <li v-for="(data, index) in overview" :key="index">
              <span class="overview-title">{{ data.title }}</span>
              <span>{{ data.value }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div>map</div>
    </div>
  </div>

  <OverviewBar />
</template>

<style scoped>
.tools {
  @apply border-2 rounded-2xl border-white py-2 px-4  bg-transparent;
  @apply text-white text-center;
}

.tools option {
  @apply text-[#000];
}
.tools.active {
  @apply bg-[#ffffff5c];
}

.overview-title {
  @apply inline-block w-32;
}
</style>
