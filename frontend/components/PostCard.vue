<template>
  <div
    class="post-card bg-gray-800 shadow overflow-hidden rounded-lg max-w-72 min-w-72 m-4 flex flex-col justify-between">
    <div class="flex flex-col flex-grow px-6 pt-6">
      <div class="flex flex-row justify-between">
        <h1 class="text-lg font-bold text-gray-300">#{{ username }}</h1>
        <button v-if="isOwner" class="text-gray-500 hover:text-blue-500" @click="editPost">
          <Icon class="editPostIcon" name="lucide:square-pen" size="24" />
        </button>
      </div>
      <hr class="mt-2 mb-2 border-gray-500">
      <p v-if="!editMode" class="mt-1 max-w-2xl text-gray-300 flex-grow py-4">{{ content }}</p>
      <textarea v-if="editMode" class="bg-gray-700 text-gray-300 flex-grow my-4 p-2 rounded"
        rows="12">{{ content }}</textarea>
      <hr class="mt-2 mb-2 border-gray-500">
    </div>
    <div class="flex flex-row justify-between px-4">
      <div :class="{ 'invisible': !editMode }" class="flex flex-row ps-2">
        <button class="text-gray-500 hover:text-green-700 me-4">
          <Icon class="editPostIcon" name="lucide:save" size="24" />
        </button>
        <button class="text-gray-500 hover:text-red-500" @click="deletePost">
          <Icon class="editPostIcon" name="lucide:trash-2" size="24" />
        </button>
      </div>
      <p class="m-4 text-sm text-gray-500 self-end">{{ created_at }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUser } from '~/composables/useCurrentUser';

const props = defineProps({
  postId: Number,
  userId: Number,
  username: String,
  content: String,
  created_at: String,
});

const emit = defineEmits(['postDeleted']);

const { api } = useApi();
const isOwner = ref(false);
const { currentUser, getCurrentUser } = useCurrentUser();
const editMode = ref(false);

onMounted(async () => {
  await getCurrentUser();
  if (currentUser.value && currentUser.value.id === props.userId) {
    isOwner.value = true;
  }
});

const editPost = () => {
  editMode.value = !editMode.value;
}

const savePost = () => {
  // Save the post
}

const deletePost = async () => {
  const answer = confirm('Are you sure you want to delete this post?');
  if (!answer) return;
  try {
    await api.delete(`/api/posts/${props.postId}`);
    emit('postDeleted', props.postId);
  } catch (error) {
    console.error(error);
  }
}
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