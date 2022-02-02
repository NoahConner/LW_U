import axios from "axios";

const instance = axios.create({
    baseURL: 'https://buybestthemes.com/leaperway_api/api/'
})

export default instance;