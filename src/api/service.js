import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://52.205.174.65:8080/'
});
export default Api;
