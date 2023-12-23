<template>
  <div class="grid h-screen w-screen grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
    <div
      v-for="color in colorScheme"
      :key="color.color"
      :style="`background-color:${color.color}`"
      class="flex justify-center cursor-pointer rounded-md outline outline-primary outline-2"
      @click="clickColor(color)"
    >
      <div
        class="text-center my-auto"
        :class="{
          'text-background': color.useDarkText
        }"
      >
        <h2 class="text-xl font-bold">
          {{ color.text }}
        </h2>
        <p>{{ color.color }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function clickColor(color: any) {
  navigator.clipboard.writeText(color.color)
  alert(`${color.color} copied to clickboard`)
}

const colorScheme = [
  {
    text: 'Primary',
    color: '#FFC107',
    useDarkText: true
  },
  {
    text: 'Primary 2',
    color: '#6366F1',
    useDarkText: false
  },
  {
    text: 'Background',
    color: '#1F2022',
    useDarkText: false
  },
  {
    text: 'Secondary Background',
    color: '#242C3A',
    useDarkText: false
  },
  {
    text: 'Text',
    color: '#F3F4F6',
    useDarkText: true
  }
]
</script>
