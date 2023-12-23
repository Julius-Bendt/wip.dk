<template>
  <div>
    <div class="grid grid-cols-2 bg-backgroundSecondary">
      <button
        :class="{ 'bg-primary': cryptoType === 'encryption' }"
        class="rounded-s-md"
        @click="setCrypto('encryption')"
      >
        Encryption
      </button>
      <button
        class="rounded-e-md"
        :class="{ 'bg-primary': cryptoType === 'decryption' }"
        @click="setCrypto('decryption')"
      >
        Decryption
      </button>
    </div>
    <div class="my-4 flex gap-4 items-center align-bottom">
      <div>
        <label for="iterations" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Iterations</label
        >
        <input
          type="number"
          id="iterations"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="10"
          required
          v-model="iterations"
        />
      </div>
      <div>
        <label class="relative flex items-center cursor-pointer">
          <input type="checkbox" value="" class="sr-only peer" v-model="hashPassword" />
          <div
            class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
          ></div>
          <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Hash password (SHA256)</span
          >
        </label>
      </div>
      <div class="flex-grow">
        <label for="passphrase" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >passphrase</label
        >
        <input
          type="password"
          id="passphrase"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="•••••••••"
          required
          v-model="passphrase"
        />
      </div>
    </div>
    <div class="my-4">
      <label class="block mt-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">
        Upload file
      </label>
      <input
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        multiple
        :disabled="passphrase.length < 8"
        @change="handleFileChange"
      />
    </div>

    <div>
      <p class="text-xl">Encrypted:</p>
      <table class="table-auto w-full text-left">
        <thead>
          <tr>
            <th>File name</th>
            <th>Start Size</th>
            <th>Size</th>
            <th>State</th>
            <th>
              Download
              <button @click="downloadAll" class="text-primary cursor-pointer">
                (download
                {{ encryptedFiles.filter((item) => item.state.includes('crypted')).length }})
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(file, i) in encryptedFiles"
            :key="file.uuid + file.state"
            :class="{ 'bg-backgroundSecondary': i % 2 == 0 }"
          >
            <td>{{ file.filename }}</td>
            <td>{{ formatBytes(file.startSize) }} ({{ file.startSize }})</td>
            <!-- <td>{{ formatBytes(file.data.length) }}</td> -->
            <td>
              {{ formatBytes(file.data?.byteLength ?? 0) }} ({{ file.data?.byteLength ?? 0 }})
            </td>

            <td>{{ file.state }}</td>
            <td>
              <button
                v-if="file.data != null"
                @click="downloadUint8ArrayAsFile(file.data, file.filename)"
                class="text-primary cursor-pointer"
              >
                Download
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { encryptData, decryptData, hashStringToSHA256 } from '@/services/Crypto'
import { downloadUint8ArrayAsFile, createZip } from '@/services/FileDownloader'

import { formatBytes } from '@/services/Formatter'

import { type ICryptoFile } from '@/interfaces/ICryptoFile'

const encryptedFiles = ref<ICryptoFile[]>([])
const cryptoType = ref('encryption')

const hashPassword = ref(true)
const passphrase = ref('')
const iterations = ref(50)

async function handleFileChange(event: any) {
  // Access the selected files from the event
  const selectedFiles: Array<File> = Array.from(event.target.files)

  const newFiles = selectedFiles.filter(
    (file) => !encryptedFiles.value.some((encryptedFile) => encryptedFile.filename === file.name)
  )

  if (cryptoType.value === 'encryption') {
    encryptFiles(newFiles)
    return
  }

  decryptFiles(newFiles)
}

function encryptFiles(newFiles: Array<File>) {
  newFiles.forEach(async (file: File) => {
    let encryptedData: ICryptoFile = {
      data: undefined,
      filename: file.name,
      uuid: file.name,
      state: 'Starting',
      startSize: file.size,
      iterations: iterations.value
    }
    encryptedFiles.value.push(encryptedData)

    const pass = hashPassword.value ? await hashStringToSHA256(passphrase.value) : passphrase.value

    const encryptedText: Uint8Array = await encryptData(
      file,
      pass,
      iterations.value,
      (iteration: number) => {
        encryptedData.state = `Iteration ${iteration}/${encryptedData.iterations}`
        updateFilesArray(encryptedData)
      }
    )

    encryptedData.state = 'Encrypted!'
    encryptedData.data = encryptedText
    updateFilesArray(encryptedData)

    // const decryptedText = decryptData(encryptedText, passphrase.value, iv)
    // console.log('Decrypted Text:', decryptedText)
  })
}

function decryptFiles(newFiles: Array<File>) {
  newFiles.forEach(async (file: File) => {
    let decryptedData: ICryptoFile = {
      data: undefined,
      filename: file.name,
      uuid: file.name,
      state: 'Starting...',
      startSize: file.size,
      iterations: iterations.value
    }
    encryptedFiles.value.push(decryptedData)
    const buffer: ArrayBuffer = await file.arrayBuffer()
    const data = new Uint8Array(buffer)

    const pass = hashPassword.value ? await hashStringToSHA256(passphrase.value) : passphrase.value
    try {
      decryptedData.data = await decryptData(data, pass, iterations.value, (iteration: number) => {
        decryptedData.state = `Iteration ${iteration}/${decryptedData.iterations}`
        updateFilesArray(decryptedData)
      })
      decryptedData.state = 'Decrypted!'
    } catch (exception) {
      decryptedData.state = 'Failed - maybe you used a wrong passphrase or amount of iterations?'
      console.log(exception)
    }

    updateFilesArray(decryptedData)
  })
}

function setCrypto(newType: string) {
  cryptoType.value = newType
  console.log(newType)
}

function updateFilesArray(newData: ICryptoFile) {
  const index = encryptedFiles.value.findIndex((file: ICryptoFile) => file.uuid === newData.uuid)
  encryptedFiles.value[index] = newData

  // Hack to force refresh
  encryptedFiles.value.push({
    data: undefined,
    filename: '',
    startSize: 0,
    state: '',
    uuid: '',
    iterations: 0
  })
  encryptedFiles.value.pop()
}

async function downloadAll() {
  let files: Record<string, Uint8Array> = {}

  encryptedFiles.value
    .filter((file) => file.state != 'Downloaded')
    .forEach((file) => {
      if (file.data == undefined) {
        console.log(`Data is invalid on file ${file.filename}`)
        return
      }

      files[file.filename] = file.data

      file.state = 'Downloaded'
      updateFilesArray(file)
    })

  const zipData = await createZip(files)
  downloadUint8ArrayAsFile(zipData, 'export.zip')
}
</script>
