import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [projet, setProjet] = useState(null);
  const [conteneurs, setConteneurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProjet = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/infoProjet/${projetId}`)
      .then(({ data }) => {
        setProjet(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du projet :", error);
        setLoading(false);
      });
  };

  const getConteneur = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/infoConteneur/${projetId}`)
      .then(({ data }) => {
        setConteneurs(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conteneurs :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProjet(projetId);
    getConteneur(projetId);
  }, [projetId]);

  return (
    <div className="projet">
      <h1>Info projet</h1>
      <div>
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
                  <strong>Numero Booking :</strong>
                  {projet.num_booking}
                </p>
                <p>
                  <strong>status :</strong>
                  {projet.status === 1 ? "Terminer" : "Actif"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="min-card">
        {conteneurs.length === 0 ? (
          <div className="card projet-info-container">
            <div className="align projet-info-header contenue">
              <h2>Aucun conteneur associé à ce projet.</h2>
            </div>
          </div>
        ) : (
          conteneurs.map((conteneur) => (
            <div
              className={` card projet-info-container ${
                conteneur.status === 1 ? "true-bg" : "false-bg"
              }`}
              key={conteneur.id}
            >
              <div className="align projet-info-header contenue">
                <h2>{conteneur.nom_projet}</h2>
                <label className="">
                  {conteneur.status === 1 ? (
                    <Link to={`/client/infoClient/infoProjet/${conteneur.id}`}>
                      Terminer
                    </Link>
                  ) : (
                    <Link to={`/client/infoClient/infoProjet/${conteneur.id}`}>
                      Actif
                    </Link>
                  )}
                </label>
              </div>
              <div className="align contenue">
                <p>
                  <strong>Numero Booking :</strong>
                </p>
                <p>{conteneur.num_booking}</p>
              </div>
              <div className="align contenue">
                <p>
                  <strong>Nombre de conteneur :</strong>
                </p>
                <p>{conteneur.totalConteneurs}</p>
              </div>
              {conteneur.status === 0 ? (
                <>
                  <div className="align contenue">
                    <p>
                      <strong>Conteneur Actif:</strong>
                    </p>
                    <p>{conteneur.conteneursActifs}</p>
                  </div>
                  <div className="align contenue">
                    <p>
                      <strong>Conteneur Terminé:</strong>
                    </p>
                    <p>{conteneur.conteneursTermines}</p>
                  </div>
                </>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
