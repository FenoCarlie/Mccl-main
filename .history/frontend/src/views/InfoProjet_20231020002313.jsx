import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [projet, setProjet] = useState(null);
  const [conteneurs, setConteneurs] = useState(null);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du projet :", error);
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
                <strong>Numero booking :</strong>
                {projet.num_booking}
              </p>
              <p>
                <strong>status :</strong>
                {projet.status === 1 ? "Terminer" : "Actif"}
              </p>
            </div>
          </div>
          <div className="card"></div>
        </div>
      )}
      </div>
      <div className="min-card">
            {conteneurs.length === 0 ? (
              <>
                <div className="card projet-info-container">
                  <div className="align projet-info-header contenue">
                    <h2>Aucun projet</h2>
                  </div>
                </div>
              </>
            ) : (
              conteneurs.map((conteneurs) => (
                <div
                  className={` card projet-info-container ${
                    conteneurs.status === 1 ? "true-bg" : "false-bg"
                  }`}
                  key={conteneurs.id}
                >
                  {console.log()}
                  <div className="align projet-info-header contenue">
                    <h2>{conteneurs.nom_projet}</h2>
                    <label className="">
                      {conteneurs.status === 1 ? (
                        <>
                          <Link
                            to={`/client/infoClient/infoProjet/${conteneurs.id}`}
                          >
                            Terminer
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/client/infoClient/infoProjet/${conteneurs.id}`}
                          >
                            Actif
                          </Link>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="align contenue">
                    <p>
                      <strong>Numero Booking :</strong>
                    </p>
                    <p>{conteneurs.num_booking}</p>
                  </div>
                  <div className="align contenue">
                    <p>
                      <strong>Nombre de conteneur :</strong>
                    </p>
                    <p>{conteneurs.totalConteneurs}</p>
                  </div>
                  {conteneurs.status === 0 ? (
                    <>
                      <div className="align contenue">
                        <p>
                          <strong>Conteneur Actif:</strong>
                        </p>
                        <p>{conteneurs.conteneursActifs}</p>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Conteneur Terminé:</strong>
                        </p>
                        <p>{conteneurs.conteneursTermines}</p>
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
