<template>
  <div>
    <h1 class="text-2xl font-extrabold mb-4">Your Feed</h1>
    <div class="flex flex-wrap">
      <PostCard v-for="post in postsWithUsernames" :key="post.id" :username="post.username" :content="post.content"
        :created_at="post.created_at" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PostCard from '~/components/PostCard.vue';

interface IPost {
  id: number;
  content: string;
  created_at: string;
  userId: number;
}

interface IUser {
  id: number;
  username: string;
}

const { baseUrl } = useApi();
const postsWithUsernames = ref<(IPost & { username: string })[]>([]);
const { data: posts } = await useFetch<IPost[]>(`${baseUrl}/api/posts`);

if (posts.value) {
  for (const post of posts.value) {
    const { data: user } = await useFetch<IUser>(`${baseUrl}/api/user/${post.userId}`);
    if (user.value) {
      const localTime = new Date(post.created_at).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
      postsWithUsernames.value.push({ ...post, username: user.value.username, created_at: localTime });
    }
  }
}


</script>
