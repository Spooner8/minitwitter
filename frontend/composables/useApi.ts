import axios, { type AxiosInstance } from 'axios'

/**
 * @description
 * This composable is responsible for creating an axios instance with the base URL of the API.  
 * It uses the runtime config to get the API base URL.  
 * 
 * @returns {Object} - The axios instance.
 */
export const useApi = (): AxiosInstance => {
    const config = useRuntimeConfig()
    const apiBaseUrl = config.public.apiBaseUrl

    const api = axios.create({
        baseURL: apiBaseUrl,
        withCredentials: true,
    })

    return api
}