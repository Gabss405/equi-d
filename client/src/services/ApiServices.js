function fetchDirectionsService({ originA, originB, originC }) {
  return fetch(
    `http://localhost:3015/getroutes/${originA}/${originB}/${originC}`
  );
}

const ApiServices = {
  fetchDirectionsService,
};

export default ApiServices;
