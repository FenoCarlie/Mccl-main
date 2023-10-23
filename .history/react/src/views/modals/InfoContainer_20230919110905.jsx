import React, { useEffect, useState } from "react";
import axios from "axios";

function InfoContainer({ id_container, setOpenModal }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/container/${id_container}`)
      .then(({ data }) => {
        setLoading(false);
        setContainer(data[0]);
        console.log('id in info: ' + data);
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
          <h1>Are You Sure You Want to Continue?</h1>
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
              <form>
                
              </form>
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
