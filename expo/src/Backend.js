
const devURL = 'http://ec2-34-201-45-125.compute-1.amazonaws.com/';
const prodURL = '';

const URL = devURL;

// Use the following functions to use post and get requests
let httpFunctions = {

  // route = the endpoint from our backend team
  // postObject = object structure to be processed
  // For structure of the POST object, see our postman
  // https://documenter.getpostman.com/view/1241148/RWaDVqx3
  post: (route, postObject) => {
    let http = new XMLHttpRequest();
    http.open("POST", URL + route, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(postObject));
  },

  postCallback: (route, postObject, callback) => {
    let http = new XMLHttpRequest();
    http.open("POST", URL + route, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
          callback(200);
        }
    }
    http.send(JSON.stringify(postObject));
  },

  // route = endpoint from backend team
  // callback = function to be called when GET returns some data
  getAsync: (route, callback) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        }
    }
    xmlHttp.withCredentials = false;
    xmlHttp.open("GET", URL + route, true);
    xmlHttp.send(null);
  },

  url: URL

}

/*
POST USAGE EXAMPLE

let Backend = require('./Backend.js');
let postObject = {
  "table_number": "1",
  "project_name": "Tim's awesome project",
  "project_url": "https://timothychen.me",
  "attempted_challenges": "Facebook's Most Inspiring Hack",
  "challenges_won": "0"
};
Backend.httpFunctions.post('api/projects/add', newProj);
*/

/*
GET USAGE EXAMPLE

let callback = (getResponse) => {
  alert(getResponse);
};
Backend.httpFunctions.getAsync('api/projects', callback);
*/

export { httpFunctions };
