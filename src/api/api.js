import axios from "axios";
import { apiRoutes } from "./apiRoutes";
const BASE_URL = import.meta.env.VITE_API_URL;
const Token = import.meta.env.VITE_BEARER_TOKEN;

export const fetchApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Credentials": "true",
    Authorization: `Bearer ${Token}`,
  },
});

class FetchData {
  async fetchCameras() {
    return fetchApi.get(apiRoutes.listCameras);
  }
  async updateCameraStatus(data) {
    return fetchApi.put(apiRoutes.updateCameraStatus, data);
  }
}
export default new FetchData();
