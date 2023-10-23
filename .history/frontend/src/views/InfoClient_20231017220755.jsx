import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

export default function InfoClient() {
  const { clientId } = useParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setClients(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {clientId}</p>
    </div>
  );
}
