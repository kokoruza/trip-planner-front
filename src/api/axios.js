import axios from "axios"

// export const API_ORIGIN = "https://localhost:7085"

export const API_ORIGIN = "https://192.168.1.145:7085"

const api = axios.create({
    baseURL: `${API_ORIGIN}/api`,
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
                `${API_ORIGIN}/api/auth/refresh`,
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