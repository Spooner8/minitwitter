<template>
  <div
    class="post-card bg-gray-800 shadow overflow-hidden rounded-lg max-w-72 min-w-72 m-4 flex flex-col justify-between">
    <div class="flex flex-col flex-grow px-6 pt-6">
      <div class="flex flex-row justify-between">
        <h1 class="text-lg font-bold text-gray-300">#{{ username }}</h1>
        <button v-if="isOwner" class="text-gray-500 hover:text-blue-500" @click="changeEditMode">
          <Icon class="editPostIcon" name="lucide:square-pen" size="24" />
        </button>
      </div>
      <hr class="mt-2 mb-2 border-gray-500">
      <p v-if="!editMode" class="mt-1 max-w-2xl text-gray-300 flex-grow py-4">{{ content }}</p>
      <textarea v-if="editMode" class="bg-gray-700 text-gray-300 flex-grow my-4 p-2 rounded"
        rows="12" v-model="modifiedContent">{{ content }}</textarea>
      <hr class="mt-2 mb-2 border-gray-500">
    </div>
    <div class="flex flex-row justify-between px-4">
      <div :class="{ 'invisible': !editMode }" class="flex flex-row ps-2">
        <button class="text-gray-500 hover:text-green-700 me-4" @click="savePost">
          <Icon class="editPostIcon" name="lucide:save" size="24" />
        </button>
        <button class="text-gray-500 hover:text-red-500" @click="deletePost">
          <Icon class="editPostIcon" name="lucide:trash-2" size="24" />
        </button>
      </div>
      <p class="m-4 text-sm text-gray-500 self-end">{{ updated_at ?? created_at }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrentUser } from '~/composables/useCurrentUser';
import type IPost from '~/models/post';
import { useLocalDateTimeFormatter } from '~/composables/useLocalDateTimeFormatter';

interface IExtendedPost extends IPost {
  username: string;
}

const props = defineProps<{
  post: IExtendedPost;
}>();

const { api } = useApi();
const { username, content, userId, id } = props.post;
const { currentUser, getCurrentUser } = useCurrentUser();
const { getLocalDateTimeString } = useLocalDateTimeFormatter();
const created_at = computed(() => getLocalDateTimeString(new Date(props.post.created_at)));
const updated_at = ref(props.post.updated_at ? getLocalDateTimeString(new Date(props.post.updated_at)) : null);

const isOwner = ref(false);
const editMode = ref(false);
const modifiedContent = ref(content);

const emit = defineEmits(['postDeleted', 'postUpdated']);

onMounted(async () => {
  await getCurrentUser();
  if (currentUser.value && currentUser.value.id === userId) {
    isOwner.value = true;
  }
});

const savePost = async () => {
  if (modifiedContent.value === content) {
    try {
      const response = await api.put(`/api/posts/${id}`, { content: modifiedContent.value });

      if(response.status === 200) {
        const updated_at_date = getLocalDateTimeString(new Date(response.data.updated_post[0].updated_at));
        updated_at.value = updated_at_date;
        emit('postUpdated', id, modifiedContent.value, updated_at_date);
      }
    } catch (error) {
      console.error(error);
    }
  }
  changeEditMode();
}

const changeEditMode = () => {
  editMode.value = !editMode.value;
  modifiedContent.value = content;
}

const deletePost = async () => {
  const answer = confirm('Are you sure you want to delete this post?');
  if (!answer) return;
  try {
    await api.delete(`/api/posts/${id}`);
    emit('postDeleted', id);
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