import React, { useEffect, useState } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";

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
        <label className="popup">
          <input type="checkbox" />
          <div className="burger" tabindex="0">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <nav className="popup-window">
            <legend>Actions</legend>
            <ul>
              <li>
                <button>
                  <svg stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle r="4" cy="7" cx="9"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span>Colloborators</span>
                </button>
              </li>
              <li>
                <button>
                  <svg stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>Magic Link</span>
                </button>
              </li>
              <hr />
              <li>
                <button>
                  <svg stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                    <rect ry="2" rx="2" height="13" width="13" y="9" x="9"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span>New transit</span>
                </button>
              </li>
              <li>
                <button>
                  <svg stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon>
                  </svg>
                  <span>Edit</span>
                </button>
              </li>
              <hr />
              <li>
                <button onClick={onDeleteClick}>
                  <svg stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
                    <line y2="18" x2="6" y1="6" x1="18"></line>
                    <line y2="18" x2="18" y1="6" x1="6"></line>
                  </svg>
                  <span>Delete</span>
                </button>
              </li>
            </ul>
          </nav>
        </label>
        </div>
        <div className="title">
          <h1>Container information</h1>
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
