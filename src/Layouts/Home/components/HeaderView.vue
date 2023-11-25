<script setup lang="ts">
import { computed } from 'vue'
import { useCounterStore } from '@/stores/president'
import { storeToRefs } from 'pinia'

const { presidentYear } = storeToRefs(useCounterStore())
const { setPresidentYear } = useCounterStore()

const presidentialDate = computed(() => [
  {
    year: 2020,
    title: '第15任總統副總選舉'
  },
  {
    year: 2016,
    title: '第14任總統副總選舉'
  },
  {
    year: 2012,
    title: '第13任總統副總選舉'
  }
])
</script>

<template>
  <header>
    <div class="container mx-auto py-4 flex gap-10">
      <a href="/">
        <UtilIcon name="Logo" class="w-14 h-14" />
      </a>

      <ul class="flex text-primary timeline gap-20 flex-1 overflow-hidden">
        <li
          v-for="(data, index) in presidentialDate"
          :key="index"
          class="timeline-item w-4/12 text-center whitespace-nowrap cursor-pointer"
          :class="{ 'text-lg font-medium': presidentYear === data.year }"
          @click="setPresidentYear(data.year)"
        >
          <span>{{ data.year }}</span>
          <span v-show="presidentYear === data.year" class="hidden lg:inline-block">
            {{ data.title }}
          </span>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scope>
header {
  background: linear-gradient(180deg, #d9d9d9 0%, #bdbdbd47 100%);
}

.timeline {
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: calc(50% + 0.5rem);
  left: 0;
  right: 0;
  height: 0.25rem;

  @apply bg-primary;
}

.timeline-item {
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 50%;
  top: calc(50% + 0.125rem + 0.5rem);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  transform: translate(-50%, -50%);

  @apply bg-primary;
}
</style>
