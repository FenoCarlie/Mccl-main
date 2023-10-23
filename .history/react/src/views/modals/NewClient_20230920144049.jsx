import React from 'react'

export default function NewClient({ setOpenModal }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
        </div>
        <div className="modalTitle">
          <h1>New client</h1>
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
  )
}
