<script setup lang="ts">
import Logo from './iconList/Logo.svg'

const icons = {
  Logo
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
