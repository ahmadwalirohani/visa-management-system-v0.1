import axios from "axios";

// Create an Axios instance with default configurations
const axiosInstance = axios.create();

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure config.headers is defined
        config.headers = config.headers || {};

        // Add branch field to request payload
        if (config.data) {
            config.data = {
                ...config.data,
                branch: localStorage.getItem("selectedBranch"),
            };
        } else {
            config.data = { branch: localStorage.getItem("selectedBranch") };
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    },
);

export default axiosInstance;
