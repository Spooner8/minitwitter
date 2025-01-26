<template>
  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <h1 class="text-2xl font-extrabold mb-4">Login Required</h1>
    <p class="text-gray-700">You must be logged in to view this page.</p>
    <button @click="goToLogin" class="mt-4 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to Login</button>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
    title: 'Login Required',
    description: 'You must be logged in to view this page.'
  })

  const goToLogin = () => {
    navigateTo('/login')
  }
</script>