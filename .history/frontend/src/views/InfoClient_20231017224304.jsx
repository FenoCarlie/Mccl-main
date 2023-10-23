import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div>
      <h1>InfoClient</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div className="card-info">
            <h3>Information client</h3>
            <div className="description">
              <div className="aling">
                <div>
                  <p>
                    <strong style={{ textAlign: "right" }}>Nom :</strong>
                  </p>
                </div>
                <div>
                  <p>{client.nom}</p>
                </div>
              </div>
              <p>
                <strong style={{ textAlign: "right" }}>Contact :</strong>
                {client.contacte}
              </p>
              <p>
                <strong style={{ textAlign: "right" }}>Adresse :</strong>
                {client.adresse}
              </p>
              <p>
                <strong style={{ textAlign: "right" }}>Email :</strong>
                {client.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
