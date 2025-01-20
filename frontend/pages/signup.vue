<template>
    <form @submit.prevent="signup" class="space-y-6 mt-10 sm:mx-auto sm:w-full sm:max-w-sm" action="#" method="POST">
        <h1 class="text-2xl font-extrabold mb-4">Sign up</h1>
        <div class="mt-2">
            <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
            <input type="text" name="username" id="username" autocomplete="username" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
        <div class="mt-2">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
        <div class="mt-2">
            <label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
        </div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
    </form>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'

    definePageMeta({
        layout: 'default',
        title: 'Login',
        description: 'Login to your account'
    })

    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const router = useRouter();

    const signup = async () => {
        if (password.value !== confirmPassword.value) {
            alert('Passwords do not match')
            return
        }

        try {
            const response = await axios.post('/api/signup', {
                username: username.value,
                password: password.value
            });
            if (response.data.success) {
                router.push('/login');
            } else {
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    }
</script>