import axios from "axios"
import { ACCESS_TOKEN } from "./constant"

declare global {
  interface ImportMetaEnv {
    VITE_API_URL: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: Error) => {
        return Promise.reject(error)
    }
)

export default api