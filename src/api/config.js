import axios from 'axios';

const BASE_API_URL = "http://localhost:8080/school";

export const API = axios.create({
    baseURL: BASE_API_URL
});
