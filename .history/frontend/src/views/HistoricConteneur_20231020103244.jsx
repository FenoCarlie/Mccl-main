import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

export default function HistoricConteneur() {
  const { conteneurId } = useParams();
  const [loading, setLoading] = useState(true);

  const getConteneur = (conteneurId) => {
    axios
      .get(`http://localhost:8081/projet/historique/${conteneurId}`)
      .then(({ data }) => {
        setConteneurs(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conteneurs :", error);
        setLoading(false);
      });
  };
  return (
    <div className="conteneur">
      <h1>Conteneur</h1>
      <div className="align">
        <div>
          {loading ? (
            <p>Chargement en cours...</p>
          ) : (
            <div>
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
              <div className="action card">
                <div className="align ">
                  <button
                    className="btn-add"
                    onClick={() => {
                      setIsModalConteneurOpen(true);
                    }}
                  >
                    Nouveau conteneur
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => setIsModalClientOpen(true)}
                  >
                    Modifier client
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
