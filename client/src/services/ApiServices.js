function fetchMidpointByNameService({ originA, originB }) {
  return fetch(`http://localhost:3015/getroutes/${originA}/${originB}/`);
}

function fetchMidpointByPlaceIDService({ placeA_id, placeB_id, mode, type }) {
  if (type === null) {
    type = 'null';
  }
  console.log(type);
  return fetch(`http://localhost:3015/getroutes/${placeA_id}/${placeB_id}/${mode}/${type}`);
}

function fetchRandomCity() {
  return fetch(`http://localhost:3015/getrandomcity`);
}

const ApiServices = {
  fetchMidpointByNameService,
  fetchMidpointByPlaceIDService,
  fetchRandomCity,
};

export default ApiServices;
