import React from "react";

function InfoContainer({idContainer, setOpenModal }) {



    const onDeleteClick = (idContainer) => {
        if (!window.confirm("Are you sure you want to delete this data?")) {
          return;
        }
        axios
          .delete(`http://localhost:8081/delete/${idContainer}`)
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
          <p>The next page looks amazing. Hope you want to go there!</p>
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
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default InfoContainer;