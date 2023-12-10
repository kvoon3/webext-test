<script setup lang="ts">
const { value } = defineModels<{
  value: boolean
}>()
</script>

<template>
  <div border="~ base rounded" flex="~ gap-2 items-center" icon-button relative h-5 w-5 p0.5>
    <div i-ri-check-line :class="value ? '' : 'op0'" />
    <input v-model="value" type="checkbox" absolute inset-0 z-10 opacity-0.1>
  </div>
</template>
