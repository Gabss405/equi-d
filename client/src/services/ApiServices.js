function fetchDirectionsService({ originA, originB }) {
  return fetch(`http://localhost:3015/getroutes/${originA}/${originB}`);
}

const ApiServices = {
  fetchDirectionsService,
};

export default ApiServices;
