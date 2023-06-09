import axios from "axios";
import rateLimit from "axios-rate-limit"

export function useTwitchAPI() {
    let isFetchingToken = false
    let failedRequestQueue = []

    const twitchApi = rateLimit(axios.create({
        baseURL: import.meta.env.VITE_TWITCH_API_BASE_URL,
        headers: {
            'Client-ID': import.meta.env.VITE_TWITCH_CLIENT_ID
        }
    }), { maxRPS: 12 })

    twitchApi.interceptors.response.use((response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        twitchApi.setMaxRPS(Math.floor((response.headers['ratelimit-remaining'] / 60)) - 1)
        return response;
    }, async (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const originalRequest = error.config

        if (error.response.status === 401 && !originalRequest._retry) {
            if (isFetchingToken) {
                try {
                    await new Promise((resolve, reject) => {
                        failedRequestQueue.push({ resolve, reject })
                    })
                    return twitchApi(originalRequest)
                } catch (error) {
                    Promise.reject(error)
                }
            }

            originalRequest._retry = true
            isFetchingToken = true

            try {
                const token = await getAuthToken()
                twitchApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
                processQueue(null, token)
                return twitchApi(originalRequest)
            } catch (error) {
                processQueue(error, null)
            } finally {
                isFetchingToken = false
            }
        }

        return Promise.reject(error)
    })

    async function getAuthToken() {
        try {
            const { data } = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&client_secret=${import.meta.env.VITE_TWITCH_CLIENT_SECRET}&grant_type=client_credentials`)

            return data.access_token

        } catch (error) {
            console.error(error.response.data)
        }
    }

    function processQueue(error, token = null) {
        failedRequestQueue.forEach(prom => {
            if (error) {
                prom.reject(error)
            } else {
                prom.resolve(token)
            }
        })

        failedRequestQueue = []
    }

    return twitchApi
}