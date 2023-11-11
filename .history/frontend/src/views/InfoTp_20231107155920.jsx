import React from "react";
import { useParams } from "react-router-dom";

export default function InfoTp() {
  const { TpId } = useParams();

  console.log(TpId);
  return (
    <div className="tp">
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Get in/Get out</h3>
          </div>
          <div></div>
        </div>
      </div>
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Conteneur vide</h3>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="bannier ">
          <div className="card-header">
            <h3>Conteneur plain</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
