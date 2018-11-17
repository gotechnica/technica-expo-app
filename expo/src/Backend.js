import axios from 'axios';
import projectData from './responseData/projects.json';
import challengeData from './responseData/challenges.json';

const backendDevURL = 'http://localhost:5000/';
const prodURL = 'https://expo-api.gotechnica.org/';

const URL = prodURL;
export const useCachedResponseData = true;

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

// Used for when useCachedResponseData is true
const rejectAll = () => {
  new Promise((reject) => {
    reject('Error: request not allowed.');
  });
};

// If useCachedResponseData, then just support projects and challenges
// endpoints and return the respective cached json data.
// Used for post-event transition to a 100% static frontend expo site
const axiosRequest = useCachedResponseData ? {
  get: (route, params) => {
    let data = null;
    if (route === 'api/projects') {
      data = projectData;
    } else if (route === 'api/challenges') {
      data = challengeData;
    }
    console.log(data);
    return new Promise((resolve, reject) => {
      if (data != null) {
        resolve(data);
      } else {
        reject('Error: request not allowed.');
      }
    }); 
  },
  post: rejectAll,
  delete: rejectAll,
} : {
  get: (route, params) => makeAxiosRequest('get', route, params),
  post: (route, params) => makeAxiosRequest('post', route, params),
  delete: (route, params) => makeAxiosRequest('delete', route, params),
};

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