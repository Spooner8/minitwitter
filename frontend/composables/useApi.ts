import axios from 'axios'

export const useApi = () => {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl

    const api = axios.create({
        baseURL: apiBaseUrl,
        withCredentials: true,
    })

    return { api }
}