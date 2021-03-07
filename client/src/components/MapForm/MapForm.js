import "./MapForm.css";
import { useState } from "react";
import ApiServices from "../../services/ApiServices";
import {
  Autocomplete,
  LoadScript,
  StandaloneSearchBox,
  useJsApiLoader,
} from "@react-google-maps/api";

//const ScriptLoaded = require("../../docs/ScriptLoaded").default;

const ApiKey = process.env.REACT_APP_API_KEY;

function MapForm({ setRouteData }) {
  const [newRouteQuery, setNewRouteQuery] = useState({
    originA: "",
    originB: "",
  });
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "YOUR_API_KEY",
  });

  const places = (process.env.REACT_APP_GOOGLE_LIBS || "").split(",");
  const handleNewDist = (e) => {
    const { name, value } = e.target;
    setNewRouteQuery({
      ...newRouteQuery,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    ApiServices.fetchDirectionsService({
      originA: newRouteQuery.originA,
      originB: newRouteQuery.originB,
    })
      .then((res) => (res.status < 400 ? res : Promise.reject()))
      .then((res) => (res.status !== 204 ? res.json() : res))
      .then((res) => setRouteData(res))
      .catch((err) => {
        console.error("Fetch Error: ", err);
      });

    // .then((fetchedRoute) => {
    //   setNewRoute(fetchedRoute);
    // });

    // ApiServices.fetchDirectionsService({
    //   originA: newRouteQuery.originB,
    //   originB: newRouteQuery.originA,
    // }).then((fetchedRoute) => {
    //   setRevRoute(fetchedRoute);
    // });

    setNewRouteQuery({ originA: "", originB: "" });
  };

  return (
    <div className="inputs-container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">
          <p>Origin A</p>

          <input
            type="text"
            value={newRouteQuery.originA}
            name="originA"
            onChange={handleNewDist}
            placeholder="enter address here..."
            className="input"
          />
        </div>

        <div className="title">
          <p>Origin B</p>

          <input
            type="text"
            value={newRouteQuery.originB}
            name="originB"
            onChange={handleNewDist}
            placeholder="enter address here..."
            className="input"
          />
        </div>
        <button className="calculate-button">Calculate Halfway</button>
      </form>
    </div>
  );

  // function postEvent(title, date, venue) {
  //   ApiServices.postEventService({ title, date, venue }).then((newEvent) => {
  //     setEvents([...events, newEvent]);
  //   });
  // }
}

export default MapForm;
