import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function InfoClient() {
  const { clientId } = useParams();
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setLoading(true);
        setClient(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getClient;
  });

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {client.nom}</p>
    </div>
  );
}
