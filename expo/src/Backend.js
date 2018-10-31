import axios from 'axios';


const backendDevURL = 'http://localhost:5000/';
const prodURL = 'https://expo-api.gotechnica.org/';

const URL = prodURL;

// axiosRequest usage examples:
/*
--- PASS IN ROUTE AND PARAMS JSON ---
axiosRequest.get('fake/route', {param_key: 'param_value'})
  .then((data) => {
    console.log(data);
  })
--- OR ONLY PASS IN ROUTE ---
axiosRequest.get('fake/route')
  .then((data) => {
    console.log(data);
  })
*/

const axiosRequest = {
  get: (route, params) => makeAxiosRequest('get', route, params),
  post: (route, params) => makeAxiosRequest('post', route, params),
  delete: (route, params) => makeAxiosRequest('delete', route, params),
}

const makeAxiosRequest = (method, route, params) => {
    return axios({
      method: method,
      url: `${URL}${route}`,
      data: params,
      withCredentials: true,
    })
      .then((response) => {
        return response.data
      })
}

export default axiosRequest;