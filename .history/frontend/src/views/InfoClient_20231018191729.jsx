import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function InfoClient() {
  const { clientId } = useParams();
  const [client, setClient] = useState({});
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setClient({ data });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  const getProjets = (clientId) => {
    axios
      .get(`http://localhost:8081/projet/${clientId}`)
      .then(({ data }) => {
        console.log("data", data);
        setProjets(data.projet);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des projets :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getClient(clientId);
    getProjets(clientId);
  }, [clientId]);

  return (
    <div className="client">
      <h1>InfoClient</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div className="card-info Wh">
            <div className="bannier">
              <h3>Information client</h3>
            </div>
            <div className="description">
              <p>
                <strong>Nom :</strong>
                {client.nom}
              </p>
              <p>
                <strong>Contact :</strong>
                {client.contacte}
              </p>
              <p>
                <strong>Adresse :</strong>
                {client.adresse}
              </p>
              <p>
                <strong>Email :</strong>
                {client.email}
              </p>
            </div>
          </div>
          <div className="card min-card">
            {projets.map((projet) => (
              <div
                className={` card projet-info-container ${
                  projet.status === 1 ? "true-bg" : "false-bg"
                }`}
                key={projet.id}
              >
                {console.log()}
                <div className="align projet-info-header contenue">
                  <h2>{projet.nom_projet}</h2>
                  <label className="">
                    {projet.status === 1 ? (
                      <>
                        <Link to={`/client/infoClient/infoProjet/${projet.id}`}>
                          Terminer
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/client/infoClient/infoProjet/${projet.id}`}>
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
                  <p>{projet.num_booking}</p>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Nombre de conteneur :</strong>
                  </p>
                  <p>{projet.totalConteneurs}</p>
                </div>
                {projet.status === 0 ? (
                  <>
                    <div className="align contenue">
                      <p>
                        <strong>Conteneur Actif:</strong>
                      </p>
                      <p>{projet.conteneursActifs}</p>
                    </div>
                    <div className="align contenue">
                      <p>
                        <strong>Conteneur Terminé:</strong>
                      </p>
                      <p>{projet.conteneursTermines}</p>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
