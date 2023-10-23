import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

export default function InfoClient() {
  const { clientId } = useParams();
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setClient(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>InfoClient</h1>
      <p>Client ID: {client.nom}</p>
    </div>
  );
}
