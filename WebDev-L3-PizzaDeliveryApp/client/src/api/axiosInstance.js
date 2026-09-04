import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const apiUrl = configuredApiUrl || (import.meta.env.PROD ? "/missing-production-api" : "http://localhost:5000/api");

const api = axios.create({
	baseURL: apiUrl,
	withCredentials: true,
});
let accessToken = null;
export const setAccessToken = (token) => { accessToken = token; };
api.interceptors.request.use((config) => { if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`; return config; });
let refreshing = null;
api.interceptors.response.use((response) => response, async (error) => { const original = error.config; if (error.response?.status === 401 && !original?._retry && !original?.url?.includes("/auth/")) { original._retry = true; refreshing ||= api.post("/auth/refresh"); try { const { data } = await refreshing; setAccessToken(data.accessToken); refreshing = null; original.headers.Authorization = `Bearer ${data.accessToken}`; return api(original); } catch (refreshError) { refreshing = null; setAccessToken(null); return Promise.reject(refreshError); } } return Promise.reject(error); });
export default api;
