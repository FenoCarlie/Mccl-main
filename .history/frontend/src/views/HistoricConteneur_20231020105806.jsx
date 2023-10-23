import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function HistoricConteneur() {
  const { conteneurId } = useParams();
  const [loading, setLoading] = useState(true);
  const [conteneur, setConteneur] = useState(null);

  const getConteneur = (conteneurId) => {
    axios
      .get(`http://localhost:8081/conteneur/${conteneurId}`)
      .then(({ data }) => {
        setConteneur(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des conteneurs :", error);
        setLoading(false);
      });
  };

  console.log(conteneurId);

  useEffect(() => {
    getConteneur(conteneurId);
  }, [conteneurId]);
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
                  <h3>Information conteneur</h3>
                </div>
                <div className="description">
                  <p>
                    <strong>Numero conteneur :</strong>
                    {conteneur.num_conteneur}
                  </p>
                  <p>
                    <strong>Line :</strong>
                    {conteneur.line}
                  </p>
                  <p>
                    <strong>Type :</strong>
                    {conteneur.type}
                  </p>
                  <p>
                    <strong>Tare :</strong>
                    {conteneur.tare}
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
