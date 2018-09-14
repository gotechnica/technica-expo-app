
const devURL = 'http://ec2-34-201-45-125.compute-1.amazonaws.com/';

let httpFunctions = {
  post: (route, postObject) => {
    let http = new XMLHttpRequest();
    http.open("POST", devURL + route, true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify(postObject));
  },

  getAsync: (route, callback) => {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          //alert(xmlHttp.responseText);
          callback(xmlHttp.responseText);
        }

    }
    xmlHttp.withCredentials = false;
    xmlHttp.open("GET", devURL + route, true);
    xmlHttp.send(null);
  }

}

export { httpFunctions };
