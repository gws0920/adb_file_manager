<script lang="ts" setup>
import routes from '@/router/routes'
const menus = computed(() => {
  return routes.filter(r => r.meta?.title)
})
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <div class="flex flex-col">
      <router-link v-for="r in menus" :key="r.path" :to="r.path">
        {{ r.meta?.title || r.name || r.path }}
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  @apply flex flex-col h-full w-full p-4;
  box-sizing: border-box;
}
</style>
