import axios from "axios";

// URL API yang akan digunakan
/* const BASE_URL_API = "http://localhost:5000/api";
const BASE_URL_IMAGES = "http://localhost:5000"; */
// Ganti URL ini saat Anda mendeploy!
const BASE_URL_API = "https://api.aisyabakery.site/api";
const BASE_URL_IMAGES = "https://api.aisyabakery.site";

const axiosClient = axios.create({
  baseURL: BASE_URL_API,
});

export { BASE_URL_IMAGES };
export default axiosClient;
