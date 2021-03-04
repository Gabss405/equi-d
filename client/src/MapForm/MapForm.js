import "./MapForm.css";
import { useState } from "react";
import ApiServices from "../services/ApiServices";
//import { Autocomplete, LoadScript } from "@react-google-maps/api";
//const ScriptLoaded = require("../../docs/ScriptLoaded").default;

function MapForm({ setRouteData }) {
  const [newRouteQuery, setNewRouteQuery] = useState({
    originA: "",
    originB: "",
  });

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
    <form onSubmit={handleSubmit} className="inputs-container">
      <p className="title">Origin A</p>
      <input
        type="text"
        value={newRouteQuery.originA}
        name="originA"
        onChange={handleNewDist}
        placeholder="enter address here..."
        className="input"
      />

      <p className="title">Origin B</p>
      <input
        type="text"
        value={newRouteQuery.originB}
        name="originB"
        onChange={handleNewDist}
        placeholder="enter address here..."
        className="input"
      />
      <button className="calculate-button">Calculate Halfway</button>
    </form>
  );

  // function postEvent(title, date, venue) {
  //   ApiServices.postEventService({ title, date, venue }).then((newEvent) => {
  //     setEvents([...events, newEvent]);
  //   });
  // }
}

export default MapForm;
