function fetchMidpointByNameService({ originA, originB }) {
  return fetch(`http://localhost:3015/getroutes/${originA}/${originB}`);
}

function fetchMidpointByPlaceIDService({ placeA_id, placeB_id }) {
  return fetch(`http://localhost:3015/getroutes/${placeA_id}/${placeB_id}`);
}

const ApiServices = {
  fetchMidpointByNameService,
  fetchMidpointByPlaceIDService,
};

export default ApiServices;
