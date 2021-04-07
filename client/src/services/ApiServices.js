// const BASE_URL = 'http://localhost:5000/';
const BASE_URL = 'https://equi-d-server.herokuapp.com/';

function fetchMidpointByNameService({ originA, originB }) {
  return fetch(`${BASE_URL}getroutes/${originA}/${originB}/`);
}

function fetchMidpointByPlaceIDService({ placeA_id, placeB_id, mode, type }) {
  if (type === null) {
    type = 'null';
  }
  console.log(type);
  return fetch(`${BASE_URL}getroutes/${placeA_id}/${placeB_id}/${mode}/${type}`);
}

function fetchRandomCity() {
  return fetch(`${BASE_URL}getrandomcity`);
}

const ApiServices = {
  fetchMidpointByNameService,
  fetchMidpointByPlaceIDService,
  fetchRandomCity,
};

export default ApiServices;
