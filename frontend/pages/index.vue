<template>
  <div>
    <h1 class="text-2xl font-extrabold mb-4">Your Feed</h1>
    <div>
      {{ posts.data }}
    </div>
  </div>
</template>

<script setup lang="ts">
  const { baseUrl } = useApi();
  const posts = await useFetch(`${baseUrl}/api/posts`);
</script>
