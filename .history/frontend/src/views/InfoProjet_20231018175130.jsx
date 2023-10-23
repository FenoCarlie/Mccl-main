import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProjet = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/infoProjet/${projetId}`)
      .then(({ data }) => {
        setProjet(data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du projet :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProjet(projetId);
  }, [projetId]);

  return (
    <div className="client">
      <h1>Info projet</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div className="card-info Wh">
            <div className="bannier">
              <h3>Information projet</h3>
            </div>
            <div className="description">
              <p>
                <strong>Nom projet :</strong>
                {projet.nom_projet}
              </p>
              <p>
                <strong>Date de creation :</strong>
                {projet.date_creation}
              </p>
              <p>
                <strong>Client :</strong>
                {projet.nom}
              </p>
              <p>
                <strong>Numero booking :</strong>
                {projet.num_booking}
              </p>
              <p>
                <strong>status :</strong>
                {projet.status}
              </p>
            </div>
          </div>
          <div className="card"></div>
        </div>
      )}
    </div>
  );
}
