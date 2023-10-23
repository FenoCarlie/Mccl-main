import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function InfoConteneur() {
  const { conteneurId } = useParams();
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);

  const getClient = (conteneurId) => {
    axios
      .get(`http://localhost:8081/client/${conteneurId}`)
      .then(({ data }) => {
        setConteneur(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  return <div>InfoConteneur</div>;
}
