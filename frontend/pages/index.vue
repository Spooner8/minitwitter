<template>
  <div>
    <h1 class="text-2xl font-extrabold mb-4">Your Feed</h1>
    <div class="flex flex-wrap">
      <PostCard v-for="post in postsWithUsernames" :key="post.id" :post="post" @postDeleted="removePost" @postUpdated="updatePost"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PostCard from '~/components/PostCard.vue';
  import type IPost from '../models/post';

  definePageMeta({
    middleware: 'auth',
    layout: 'default',
    title: 'Your Feed',
    description: 'This page is protected and requires login'
  });

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
        postsWithUsernames.value.push({ ...post, username: user.username, created_at: post.created_at });
      }
    }
  }

  //FIXME: Post is not updating in the frontend. Update is visible only after refreshing the page.
  const updatePost = (postId: number, updatedContent: string, updated_at: Date) => {
    const index = postsWithUsernames.value.findIndex((post) => post.id === postId);
    if (index !== -1) {
      // Create a copy of the array
      const updatedPosts = [...postsWithUsernames.value];
      // Replace the old post with a new object
      updatedPosts[index] = { 
        ...updatedPosts[index], 
        content: updatedContent, 
        updated_at: updated_at 
      };
      // Assign the new array to trigger reactivity
      postsWithUsernames.value = updatedPosts;
    }
  }

  const removePost = (postId: number) => {
    postsWithUsernames.value = postsWithUsernames.value.filter((post) => post.id !== postId);
  }
</script>