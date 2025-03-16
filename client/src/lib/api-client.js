import axios from "axios";
import {HOST} from "@/utils/constants";
const apiClient = axios.create({
    baseURL:import.meta.env.MODE === "development"? "http://localhost:8747" :  HOST,
  });
export default apiClient;  