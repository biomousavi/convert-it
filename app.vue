<!-- eslint-disable no-new -->
<script setup lang="ts">
import Parallax from 'parallax-js';
import { mdiFileUploadOutline, mdiArrowDown, mdiMenuDown, mdiCloseCircle } from '@mdi/js';
import { createFFmpeg, fetchFile, type FFmpeg } from '@ffmpeg/ffmpeg';

let ffmpeg: FFmpeg;
const selectedFormat = ref();
const inputFile = ref<File>();
const scene = ref<HTMLDivElement>();
const loadingFfmpeg = ref(false);
const convertLoading = ref(false);
const outputUri = ref<string>();

const formats = [
  { title: 'AVI', value: 'avi' },
  { title: 'MKV', value: 'mkv' },
  { title: 'MP4', value: 'mp4' },
  { title: 'WebM', value: 'webm' },
];

const IS_COMPATIBLE = typeof SharedArrayBuffer === 'function';
const mainName = IS_COMPATIBLE ? 'proxy_main' : 'main';
const corePath = IS_COMPATIBLE
  ? 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
  : 'https://unpkg.com/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js';

function download() {
  if (outputUri.value) {
    const outputName = `converted.${selectedFormat.value}`;

    // create new element and set uri
    const link = document.createElement('a');
    link.download = outputName;
    link.href = outputUri.value;
    document.body.appendChild(link);

    // star downloading
    link.click();

    // remove created element
    document.body.removeChild(link);
  }
}

function onUpload() {
  const input = document.createElement('input');
  input.onchange = onChangeInput;
  input.type = 'file';
  input.click();
}

function readFromBlobOrFile(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result as ArrayBuffer);
    };
    fileReader.onerror = () => {
      reject(Error('File could not be read!'));
    };

    fileReader.readAsArrayBuffer(blob);
  });
}

async function loadFFmpeg() {
  loadingFfmpeg.value = true;

  ffmpeg = createFFmpeg({ log: true, mainName, corePath });
  await ffmpeg?.load();

  loadingFfmpeg.value = false;
}

async function startConvert() {
  if (inputFile.value) {
    convertLoading.value = true;

    const readFile = await readFromBlobOrFile(inputFile.value);
    const file = new Uint8Array(readFile);

    const outputName = `converted.${selectedFormat.value}`;

    ffmpeg.FS('writeFile', inputFile.value.name, await fetchFile(file));
    await ffmpeg.run('-i', inputFile.value.name, outputName);
    const data = ffmpeg.FS('readFile', outputName);

    const downloadType = `video/${selectedFormat.value}`;
    outputUri.value = URL.createObjectURL(new Blob([data.buffer], { type: downloadType }));

    convertLoading.value = false;
  }
}

async function onChangeInput({ target }: Event) {
  const input = (target as HTMLInputElement)?.files?.[0];

  if (input) {
    const inputFileType = input.name.split('.').at(-1);
    const supportedFormat = formats.some((format) => format.value === inputFileType);

    if (supportedFormat) {
      await loadFFmpeg();
      inputFile.value = input;
    }
  }
}

onMounted(() => {
  new Parallax(scene.value!, { hoverOnly: true });
});
</script>

<template>
  <VApp>
    <AppHead />

    <div class="container overflow-hidden">
      <div ref="scene" class="scene w-100 h-100">
        <div class="w-100 h-100" data-depth="0.3">
          <VImg class="glasses" src="/glasses.png" width="10%" />
        </div>

        <div class="w-100 h-100" data-depth="0.15">
          <VImg class="video" src="/video.png" width="10%" />
        </div>

        <div class="w-100 h-100" data-depth="0.1">
          <VImg class="wav" src="/wav.png" width="10%" />
        </div>
      </div>
      <VRow class="input mx-0 w-100 h-100" justify="center" align="center">
        <VCol cols="8" md="3" class="d-flex flex-column align-center rounded-lg text-center">
          <VSlideYTransition group>
            <VBtn
              key="1"
              :loading="loadingFfmpeg"
              variant="flat"
              rounded="lg"
              size="large"
              class="font-weight-bold text-capitalize text-truncate"
              @click="onUpload"
            >
              <VIcon v-if="!inputFile" size="large" :icon="mdiFileUploadOutline" />
              <span v-if="!inputFile" class="mx-2">Input</span>
              <span v-if="inputFile" class="mx-2"> {{ inputFile?.name }} </span>
            </VBtn>

            <div
              v-if="inputFile"
              key="2"
              class="w-100 d-flex flex-column align-center justify-center"
            >
              <VIcon key="1" color="white" class="my-5" :icon="mdiArrowDown" />
              <v-select
                key="2"
                v-model="selectedFormat"
                clearable
                :clear-icon="mdiCloseCircle"
                :menu-icon="mdiMenuDown"
                density="comfortable"
                variant="solo"
                class="text-h6 w-100 text-white"
                :items="formats"
                placeholder="Select Output Format"
                label="Select Output Format"
                hide-details
                single-line
              ></v-select>
            </div>
            <div
              v-if="selectedFormat"
              key="3"
              class="w-100 d-flex flex-column align-center justify-center"
            >
              <VIcon key="1" color="white" class="my-5" :icon="mdiArrowDown" />

              <VBtn
                variant="flat"
                rounded="lg"
                size="large"
                :loading="convertLoading"
                class="font-weight-bold text-capitalize text-truncate"
                @click="startConvert"
              >
                <span class="mx-2">Convert</span>
              </VBtn>
            </div>
            <div
              v-if="outputUri"
              key="4"
              class="w-100 d-flex flex-column align-center justify-center"
            >
              <VIcon key="1" color="white" class="my-5" :icon="mdiArrowDown" />

              <VBtn
                variant="flat"
                rounded="lg"
                size="large"
                class="font-weight-bold text-capitalize text-truncate"
                @click="download"
              >
                <span class="mx-2">download</span>
              </VBtn>
            </div>
          </VSlideYTransition>
        </VCol>
      </VRow>
    </div>
  </VApp>
</template>

<style>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.container {
  min-width: 100%;
  min-height: 100vh;
  position: relative;
}

.input {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
}

.scene {
  position: relative;
  background: linear-gradient(135deg, #34568b 0%, #6b5b95 100%);
}

div.glasses {
  position: absolute;
  left: 10%;
  top: 15%;
}

div.video {
  position: absolute;
  right: 6%;
  top: 10%;
}

div.wav {
  position: absolute;
  left: 30%;
  bottom: 15%;
}
</style>
