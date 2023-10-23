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
            <h2>Information client</h2>
          </div>
        </div>
      )}
    </div>
  );
}
