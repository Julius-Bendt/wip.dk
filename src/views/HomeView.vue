<template>
  <main class="flex h-screen w-screen justify-center">
    <div class="text-center my-auto">
      <h1 className="text-8xl font-bold">Hello world!</h1>
      <h2 class="text-4xl mt-2">Weekend In Progress</h2>
      <div class="mb-6">
        <p>
          Welcome to WIP! on here, I upload different weekend projects and other tools I often use.
        </p>
        <p>Below are the tools currently developed:</p>
        <ul>
          <li v-for="site in sites" :key="site.routeName">
            • <span class="font-bold">{{ site.title }}</span
            >: {{ site.description }}
          </li>
        </ul>
      </div>
      <div class="grid grid-cols-3">
        <button
          @click="gotoSite(site)"
          v-for="site in sites"
          :key="site.routeName"
          class="outline outline-primary mx-2 h-16"
        >
          <p>{{ site.title }}</p>
        </button>
      </div>
      <p class="mt-4">
        check out my professional portfolio at
        <a class="text-primary" href="https://jub.dk" target="_blank">jub.dk</a>
      </p>
      <p>
        Interrested in forking the site? Its available
        <a class="text-primary" href="https://github.com/Julius-Bendt/wip.dk" target="_blank"
          >on Github</a
        >
      </p>
      <p>
        Do you have any questions, comments or just wanna talk tech? send me a mail at
        <a class="text-primary" href="mailto:secret@wip.dk">secret@wip.dk</a>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'

const sites = [
  {
    title: 'Colors',
    routeName: 'colors',
    description: 'Color scheme I use across different projects'
  },
  {
    title: 'Tools',
    routeName: 'tools',
    description: 'Tools I always install when I reset my computer'
  },
  {
    title: 'Crypto',
    routeName: 'crypto',
    description:
      'A page for encrypting files using symmetric AES256 - powered by modern browser APIs'
  }
]

function gotoSite(site: any) {
  router.push({ name: site.routeName })
}
</script>
