import axios from "axios";

const instance = axios.create({
    baseURL: 'https://leaperway.app/leaperway_api/api/'
})

export default instance;