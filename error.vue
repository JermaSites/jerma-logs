<script setup lang="ts">
const error = useError()

function handleError() {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <NuxtLayout name="error">
    <div class="text-center">
      <h1 class="text-9xl">
        {{ error.statusCode }}
      </h1>
      <h2 class="text-6xl">
        {{ error.message }}
      </h2>

      <div class="test">
        <button class="btn border-2 border-blue-500 bg-slate-800 hover:bg-slate-900 font-bold tracking-wide p-4 mt-4" @click="handleError">
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.btn {
  overflow: hidden;
  position: relative;
}

.btn span {
  position: relative;
  display: block;
  z-index: 10;
}

.btn:hover {
  color: black;
  transition: 1s;
}

.btn::before {
  content: '';
  display: block;
  position: absolute;
  top: -110%;
  left: -10%;
  width: 120%;
  height: 0;
  padding-bottom: 120%;
  border-radius: 50%;
  background-color: #3b82f6;
  transform: translate3d(0, 68%, 0) scale3d(0,0,0);
}

.btn:hover::before {
  transform: translate3d(0, 0, 0) scale3d(1,1,1);
  transition: .5s all;
}

.btn::after {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #3b82f6;
  transform: translate3d(0, -100%, 0);
  transition-duration: .3s;
  transition-timing-function: linear;
}

.btn:hover::after {
  transform: translate3d(0, 0, 0);
  transition-delay: .5s;
  transition-duration: .05s;
  transition-timing-function: linear;
}
</style>
