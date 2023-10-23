import React from "react";

export default function GetIn() {
  return (
    <>
      <div className="card">
        <div className="card-img"></div>
        <div className="card-info">
          <div className="card-text">
            <p className="text-title">Card</p>
            <p className="text-subtitle">This is a subtitle</p>
          </div>
          <button className="card-icon">
            <svg className="icon" viewBox="0 0 28 25">
              <path d="M13.145 2.13l1.94-1.867 12.178 12-12.178 12-1.94-1.867 8.931-8.8H.737V10.93h21.339z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
