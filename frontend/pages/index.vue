<template>
    <div>
        <h1 class="text-2xl font-extrabold mb-4">Your Feed</h1>
        <button
            @click="showNewPostModal = true"
            class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
            New Post
        </button>
        <div class="flex flex-wrap">
            <PostCard
                v-for="post in postsWithUsernames"
                :key="post.id"
                :post="post"
                @postDeleted="removePost"
                @postUpdated="updatePost"
            />
        </div>
        <NewPostModal
            v-if="showNewPostModal"
            @close="showNewPostModal = false"
            @postCreated="addPost"
        />
    </div>
</template>

<script setup lang="ts">
import PostCard from '~/components/PostCard.vue';
import NewPostModal from '~/components/NewPostModal.vue';
import type IPost from '../models/post';

definePageMeta({
    middleware: 'auth',
    layout: 'default',
    title: 'Your Feed',
    description: 'This page is protected and requires login',
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
            postsWithUsernames.value.push({
                ...post,
                username: user.username,
                created_at: post.created_at,
            });
        }
    }
}

const showNewPostModal = ref(false);

const addPost = async (newPost: IPost) => {
    try {
        const { data: user } = await api.get<IUser>(
            `/api/user/${newPost.userId}`
        );
        if (user) {
            postsWithUsernames.value.unshift({
                ...newPost,
                username: user.username,
            });
            showNewPostModal.value = false;
        }
    } catch (error) {
        console.error('Post creation error:', error);
    }
};

const updatePost = (postId: number, updatedContent: string) => {
    const index = postsWithUsernames.value.findIndex(
        (post) => post.id === postId
    );
    if (index !== -1) {
        const updatedPosts = [...postsWithUsernames.value];
        updatedPosts[index] = {
            ...updatedPosts[index],
            content: updatedContent,
        };
        postsWithUsernames.value = updatedPosts;
    }
};

const removePost = (postId: number) => {
    postsWithUsernames.value = postsWithUsernames.value.filter(
        (post) => post.id !== postId
    );
};
</script>
