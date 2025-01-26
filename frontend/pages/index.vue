<template>
  <div>
    <h1 class="text-2xl font-extrabold mb-4">Your Feed</h1>
    <div class="flex flex-wrap">
      <PostCard v-for="post in postsWithUsernames" :key="post.id" :username="post.username" :content="post.content"
        :created_at="post.created_at" :userId="post.userId" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import PostCard from '~/components/PostCard.vue';

  definePageMeta({
    middleware: 'auth',
    layout: 'default',
    title: 'Your Feed',
    description: 'This page is protected and requires login'
  })

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

  const { api } = useApi();
  const postsWithUsernames = ref<(IPost & { username: string })[]>([]);
  const { data: posts } = await api.get<IPost[]>('/api/posts');

  if (posts && posts.length > 0) {
    for (const post of posts) {
      const { data: user } = await api.get<IUser>(`/api/user/${post.userId}`);
      if (user) {
        const localTime = new Date(post.created_at).toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        postsWithUsernames.value.push({ ...post, username: user.username, created_at: localTime });
      }
    }
  }
</script>