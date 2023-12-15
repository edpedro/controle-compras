import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://finance-back.adaptable.app/",
  //baseURL: "http://localhost:3000/",
});

export default api;
