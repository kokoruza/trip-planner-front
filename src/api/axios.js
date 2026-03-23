import axios from "axios"

// Для dev: используется /api (proxy в vite.config.js)
// Для prod: используется переменная окружения или /api
export const API_ORIGIN = "/api"
export const MEDIA_BASE = "" // Пустая строка = текущий хост

// Функция для получения URL медиа файлов (аватары, галерея)
export const getMediaUrl = (path) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    // Путь вида "/avatars/..." или "/uploads/..." идёт прямо без /api префикса
    return `${MEDIA_BASE}${path}`
}

const api = axios.create({
    baseURL: API_ORIGIN,
    withCredentials: true
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    res => res,
    async error => {

        const original = error.config

        if (error.response?.status === 401 && !original._retry) {

            original._retry = true

            const refresh = localStorage.getItem("refreshToken")

            const response = await axios.post(
                `/api/auth/refresh`,
                { refreshToken: refresh }
            )

            const newAccess = response.data.accessToken

            localStorage.setItem("accessToken", newAccess)

            original.headers.Authorization = `Bearer ${newAccess}`

            return api(original)
        }

        return Promise.reject(error)
    }
)

export default api