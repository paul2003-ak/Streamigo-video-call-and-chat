import axios from "axios"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

 export const axiosIntance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true
 })
 