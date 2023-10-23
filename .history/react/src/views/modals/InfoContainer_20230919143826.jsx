import React, { useEffect, useState } from "react";
import axios from "axios";

function InfoContainer({ id_container, setOpenModal }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [container, setContainer] = useState({
    id_container: null,
    num_container: "",
    name_container: "",
    type: "",
    category: "",
    status: "",
    live: "",
    code_location_tp: "",
    tp_name: "",
    position: "",
    date_in: "",
    date_out: ""
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8081/container/${id_container}`)
      .then(({ data }) => {
        setLoading(false);
        setContainer(data[0]);
        console.log("id in info: " + data);
      })
      .catch((error) => {
        setLoading(false);
        setErrors(error.response.data);
      });
  }, [id_container]);

  const onDeleteClick = () => {
    if (!window.confirm("Are you sure you want to delete this data?")) {
      return;
    }
    axios
      .delete(`http://localhost:8081/delete/${id_container}`)
      .then((response) => {
        getContainer();
        console.log(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while deleting the container:", error);
      });
  };

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
          <h1>Container information</h1>
          <div className="dropdown">
            <button className="dropdown-toggle">Options</button>
            <ul className="dropdown-menu">
              <li>
                <button onClick={() => console.log("Option 1 clicked")}>
                  Option 1
                </button>
              </li>
              <li>
                <button onClick={() => console.log("Option 2 clicked")}>
                  Option 2
                </button>
              </li>
              <li>
                <button onClick={() => console.log("Option 3 clicked")}>
                  Option 3
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="body">
          <div className="card animated fadeInDown">
            {loading && <div className="text-center">Loading...</div>}
            {errors && (
              <div className="alert">
                {Object.keys(errors).map((key) => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            )}
            {!loading && (
              <div className="list">
                <ul>
                  <li>Number container:</li>
                  <li>Type:</li>
                  <li>Category:</li>
                  <li>Status:</li>
                  <li>Line:</li>
                  <li>Location:</li>
                  <li>Position:</li>
                  <li>Client:</li>
                  <li>Transport:</li>
                  <li>Truck number:</li>
                  <li>Truck type:</li>
                  <li>Driver:</li>
                  <li>Departure:</li>
                  <li>Get in:</li>
                  <li>Transit time:</li>
                  <li>Gross weight:</li>
                  <li>Tare:</li>
                  <li>Weight:</li>
                  <li>Shipment:</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={onDeleteClick}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default InfoContainer;
