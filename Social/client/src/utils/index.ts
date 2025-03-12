import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
    baseURL: API_URL,
    responseType: "json",
});

interface ApiRequestParams {
    url: string;
    token?: string;
    data?: any;
    method?: string;
}

interface FetchPosts {
    url: string;
    token?: string;
    data?: any;
    dispatch?: React.Dispatch<any>
}

export const apiRequest = async ({ url, token, data, method }: ApiRequestParams) => {
    try {
        const result = await API(url, {
            method : method || "GET",
            data,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            }
        });

        return result.data;
    } catch (error) {
        console.error("API request error:", error);
        return null;
    }
};

export const handleFileUpload = async (uploadFile: File | Blob) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "socialmedia");

    try {
        const response = await axios.post(
            `https://api/cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_ID}/image/upload`,formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error("API request error:", error);
        return null;
    }
};

export const fetchPosts: FetchPosts = async (url, token, data, deispatch)  => {

}