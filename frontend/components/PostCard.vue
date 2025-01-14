<template>
    <div class="post-card bg-gray-800 shadow overflow-hidden rounded-lg max-w-72 min-w-72 m-4 flex flex-col justify-between">
      <div class="flex flex-col flex-grow px-6 pt-6">
        <h1 class="text-lg font-bold text-gray-300">#{{ username }}</h1>
        <hr class="mt-2 mb-2 border-gray-500">
        <p class="mt-1 max-w-2xl text-gray-300 flex-grow py-4">{{ content }}</p>
        <hr class="mt-2 mb-2 border-gray-500">
    </div>
      <p class="m-4 text-sm text-gray-500 self-end">{{ created_at }}</p>
    </div>
  </template>

<script setup lang="ts">
    defineProps({
        username: String,
        content: String,
        created_at: String,
    });
</script>

<style scoped>
    .post-card {
        transition: transform 0.6s, filter 1.4s;
    }
    .post-card:hover {
        z-index: 1;
        transform: scale(1.4);
        filter: drop-shadow(0 0 1.6rem rgb(0, 162, 255));
    }
</style>