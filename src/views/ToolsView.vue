<template>
  <div class="h-screen w-screen flex-col space-y-4">
    <div v-for="group in programGroups" :key="group.name">
      <h2 class="text-3xl font-bold mb-2">{{ group.name }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <a
          v-for="program in group.items"
          :key="program.link"
          class="flex justify-center rounded-md outline outline-primary outline-2 p-2 m-0.5"
          :href="program.link"
          target="_blank"
        >
          <div class="text-center my-auto">
            <h2 class="text-2xl">
              {{ program.name }}
            </h2>
            <a>{{ getDomainFromUri(program.link) }}</a>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function getDomainFromUri(uri: string): string {
  const regex = /https?:\/\/(?:www\.)?([^\/]+)\/?/
  const matches = uri.match(regex)

  if (matches != null && matches?.length > 1) {
    return matches[1] as string
  }

  return uri
}

const programGroups = [
  {
    name: 'Dev programs',
    items: [
      {
        name: 'VS code',
        link: 'https://code.visualstudio.com/',
        icon: ''
      },
      {
        name: 'Source tree',
        link: 'https://www.sourcetreeapp.com/',
        icon: ''
      },
      {
        name: 'Git Bash',
        link: 'https://git-scm.com/downloads',
        icon: ''
      },
      {
        name: 'Node',
        link: 'https://nodejs.org/en',
        icon: ''
      },
      {
        name: 'Paint.NET',
        link: 'https://www.getpaint.net/download.html#download',
        icon: ''
      },
      {
        name: 'HeidiSQL',
        link: 'https://www.heidisql.com/',
        icon: ''
      }
    ]
  },
  {
    name: 'Utilities',
    items: [
      {
        name: 'F.lux',
        link: 'https://justgetflux.com/',
        icon: ''
      },
      {
        name: '7-Zip',
        link: 'https://7-zip.org/',
        icon: ''
      },
      {
        name: 'C-Cleaner',
        link: 'https://www.ccleaner.com/ccleaner/download',
        icon: ''
      },
      {
        name: 'Chrome',
        link: 'https://www.google.com/chrome/',
        icon: ''
      },
      {
        name: 'MalwareBytes',
        link: 'https://www.malwarebytes.com/',
        icon: ''
      },
      {
        name: 'Cheat Engine',
        link: 'https://www.patreon.com/cheatengine',
        icon: ''
      },
      {
        name: 'PowerToys',
        link: 'https://learn.microsoft.com/en-us/windows/powertoys/install',
        icon: ''
      },
      {
        name: 'WinSCP',
        link: 'https://winscp.net/eng/download.php',
        icon: ''
      },
      {
        name: 'Docker',
        link: 'https://www.docker.com/',
        icon: ''
      },
      {
        name: 'Audacity',
        link: 'https://www.audacityteam.org/',
        icon: ''
      },
      {
        name: 'Proton Bridge',
        link: 'https://proton.me/mail/bridge',
        icon: ''
      },
      {
        name: 'Proton Drive',
        link: 'https://proton.me/drive/download',
        icon: ''
      }
    ]
  },
  {
    name: 'Gaming',
    items: [
      {
        name: 'Steam',
        link: 'https://store.steampowered.com/about/',
        icon: ''
      },
      {
        name: 'Epic launcher',
        link: 'https://store.epicgames.com',
        icon: ''
      }
    ]
  }
]
</script>
