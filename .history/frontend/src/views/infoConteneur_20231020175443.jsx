import axios from "axios";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { iconsImgs } from "../icon/icone";

export default function InfoConteneur() {
  const { conteneurId } = useParams();
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConteneur(conteneurId);
  }, [conteneurId]);

  const getConteneur = (conteneurId) => {
    axios
      .get(`http://localhost:8081/conteneur/${conteneurId}`)
      .then(({ data }) => {
        setConteneur(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  return (
    <div className="conteneur">
      <h1 className="align">Information Conteneur</h1>
      <div className="align"></div>
    </div>
  );
}
