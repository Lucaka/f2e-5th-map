<script setup lang="ts">
import HeaderView from '@/Layouts/Home/components/HeaderView.vue'
</script>

<template>
  <div class="flex flex-col min-h-full">
    <HeaderView />
    <main class="h-full">
      <RouterView />
    </main>
  </div>
</template>
