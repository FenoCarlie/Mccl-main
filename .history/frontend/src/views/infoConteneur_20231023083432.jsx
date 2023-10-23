import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { iconsImgs } from "../icon/icone";
import { Modal } from "react-modal";

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

  const customStylesModal = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      borderRadius: "15px",
    },
    overlay: {
      backgroundColor: "rgb(189 189 189 / 75%)",
    },
  };

  return (
    <div className="conteneur">
      <div className="card-header">
        <h1 className="align">Information Conteneur</h1>
      </div>
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
                    className="btn-edit"
                    onClick={() => setIsModalMouvementOpen(true)}
                  >
                    Mouvement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalMouvementOpen}
        onRequestClose={() => setIsModalMouvementOpen(false)}
        contentLabel="Mouvement Modal"
        style={customStylesModal}
      ></Modal>
    </div>
  );
}
