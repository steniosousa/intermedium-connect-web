import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://intermedium-82a2984b7ba3.herokuapp.com/',
  // baseURL:'http://localhost:8080/'

});
export default Api;
