import axios from 'axios';

const Api = axios.create({
  // baseURL: 'http://localhost:8080/',
  baseURL: 'https://intermedium-connect-api-pht9-dev.fl0.io/',

});
export default Api;
