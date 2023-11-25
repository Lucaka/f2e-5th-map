<script setup lang="ts">
import Logo from './iconList/map-logo.vue'
import ArrowUp from './iconList/arrow-up.vue'
import ChevronDown from './iconList/chevron-down.vue'
import Search from './iconList/search-btn.vue'

const icons = {
  Logo,
  ArrowUp,
  ChevronDown,
  Search
}

type IconType = keyof typeof icons

withDefaults(
  defineProps<{
    name: IconType
  }>(),
  {}
)
</script>

<template>
  <component v-if="name" :is="icons[name]" />
</template>
