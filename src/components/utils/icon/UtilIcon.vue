<script setup lang="ts">

const icons = {

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
