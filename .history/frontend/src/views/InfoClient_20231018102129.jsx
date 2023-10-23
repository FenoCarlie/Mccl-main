import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Booking from "./Booking";

export default function InfoClient() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setClient(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getClient(clientId);
  }, [clientId]);

  return (
    <div className="client">
      <h1>InfoClient</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div className="card-info Wh">
            <div className="bannier">
              <h3>Information client</h3>
            </div>
            <div className="description">
              <p>
                <strong>Nom :</strong>
                {client.nom}
              </p>
              <p>
                <strong>Contact :</strong>
                {client.contacte}
              </p>
              <p>
                <strong>Adresse :</strong>
                {client.adresse}
              </p>
              <p>
                <strong>Email :</strong>
                {client.email}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="align">
              <h2>nom projet</h2>
              <label className="status">
                <span className="true"></span>
              </label>
              <label className="status">
                <span className="false"></span>
              </label>
            </div>
            <div className="align">
              <p>
                <strong>Numero Booking :</strong>
              </p>
              <p>122135133</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
