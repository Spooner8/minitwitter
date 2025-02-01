<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">New Post</h2>
      <textarea v-model="content" class="w-full p-2 border rounded mb-4" rows="4" placeholder="What's on your mind?"></textarea>
      <div class="flex justify-end">
        <button @click="cancel" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
        <button @click="generatePost" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Generate Post</button>
        <button @click="post" class="bg-blue-500 text-white px-4 py-2 rounded">Post</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { api } = useApi();
const content = ref('');
const emit = defineEmits(['close', 'postCreated']);

const cancel = () => {
  emit('close');
};

const post = async () => {
  try {
    const response = await api.post('/api/posts', { content: content.value });
    if (response.status === 201) {
      emit('postCreated', response.data[0]);
      emit('close');
    } else {
      alert('Failed to create post');
    }
  } catch (error) {
    console.error('Post creation error:', error);
  }
};

const generatePost = async () => {
  try {
    const response = await api.post('/api/posts/generate');
    if (response.status === 201) {
      content.value = response.data['Post generated'][0].content;
    } else {
      alert('Failed to generate post');
    }
  } catch (error) {
    console.error('Post generation error:', error);
  }
};
</script>
