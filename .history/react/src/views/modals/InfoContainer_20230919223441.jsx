import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from './../../../../frontend/src/components/views/Container';

function InfoContainer({ selectedId, setOpenModal }) {
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
    date_departure: "",
    date_arrived: "",
    tare: "",
    gross_weight: "",
    weight_cum: "",
    weight_dep: "",
    transit_time: "",
    shipment: ""
  });
  
  const id_container = selectedId;
  
  const getContainer = () => {
    if (id_container) {
        setLoading(true);
        axios.get(`http://localhost:8081/container/${id_container}`)
          .then(({ data }) => {
            setLoading(false);
            setContainer(data[0]);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        console.log('no id_container');
      }
  }

  useEffect(() => {
    getContainer();
  }, []);

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
        </div>
        <div className="modalTitle">
          <h1>Container N: {container.num_container}</h1>
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
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span>get pdf</span>
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
                  <svg stroke-linejoin="round" stroke-linecap="round" color="red" stroke-width="2" stroke="currentColor" fill="none" viewBox="0 0 24 24" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
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
                  <li>Type: 
                    <label className="info_label">
                        {container.type}
                    </label>
                  </li>
                  <li>Category: 
                    <label className="info_label">
                    {container.category}
                    </label>
                  </li>
                  <li>Status: 
                    <label className="info_label">
                    {container.status}
                    </label>
                  </li>
                  <li>Line: 
                    <label className="info_label">
                    {container.line}
                    </label>
                  </li>
                  <li>Location: 
                    <label className="info_label">
                        {container.tp_name}
                    </label>
                  </li>
                  <li>Position: 
                    <label className="info_label">
                        {container.position}
                    </label>
                  </li>
                  <li>Client: 
                    <label className="info_label">
                        {container.client}
                    </label>
                  </li>
                  <li>Transport: 
                    <label className="info_label">
                        {container.transport}
                    </label>
                  </li>
                  <li>Truck number: 
                    <label className="info_label">
                        {container.num_truck}
                    </label>
                  </li>
                  <li>Truck type: 
                    <label className="info_label">
                        {container.type_truck}
                    </label>
                  </li>
                  <li>Driver: 
                    <label className="info_label">
                        {container.driver}
                    </label>
                  </li>
                  <li>Departure: 
                    <label className="info_label">
                        {container.date_departure}
                    </label>
                  </li>
                  <li>Get in: 
                    <label className="info_label">
                        {Container.date_arrived}
                    </label>
                  </li>
                  <li>Transit time: 
                    <label className="info_label">
                        {container.transit_time}
                    </label>
                  </li>
                  <li>Gross weight: 
                    <label className="info_label">
                        {container.gross_weight}
                    </label>
                  </li>
                  <li>Tare: 
                    <label className="info_label">
                        {container.tare}
                    </label>
                  </li>
                  <li>Weight: 
                    <label className="info_label">
                        {container.weight}
                    </label>
                  </li>
                  <li>Shipment: 
                    <label className="info_label">
                        {container.shipment}
                    </label>
                  </li>
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
        </div>
      </div>
    </div>
  );
}

export default InfoContainer;
