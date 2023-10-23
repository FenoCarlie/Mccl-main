import React from "react";

export default function GetIn() {
  return (
    <div className="card">
      <div className="card-getin">
        <div className="card-img-getin"></div>
        <div className="card-info-getin">
          <div className="card-getin-container"></div>
          <div className="card-getin-footer">
            <div className="card-text-getin">
              <p className="text-subtitle-getin">Get in</p>
            </div>
            <button className="card-icon-getin">
              <svg className="icon-getin" viewBox="0 0 28 25">
                <path d="M13.145 2.13l1.94-1.867 12.178 12-12.178 12-1.94-1.867 8.931-8.8H.737V10.93h21.339z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
