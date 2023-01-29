<script setup lang="ts">
import { mdiFileUploadOutline } from '@mdi/js';

import Parallax from 'parallax-js';
const scene = ref<HTMLDivElement>();

onMounted(() => {
  const parallax = new Parallax(scene.value!, { hoverOnly: true });

  console.log(parallax);
});
</script>

<template>
  <VApp>
    <AppHead />

    <div class="container">
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

        <div class="w-100 h-100"></div>
      </div>
      <VRow class="input mx-0 w-100 h-100" justify="center" align="center">
        <VCol cols="8" md="2" class="rounded-lg text-center">
          <VBtn class="font-weight-bold" variant="flat" rounded="lg" size="large">
            <VIcon size="large" :icon="mdiFileUploadOutline" />
            <span class="mx-2">Input</span>
          </VBtn>
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
