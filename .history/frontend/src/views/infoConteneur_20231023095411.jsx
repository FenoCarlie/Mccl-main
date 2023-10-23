import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { iconsImgs } from "../icon/icone";
import { Modal } from "react-modal";
import { Stepper } from "react-stepper-horizontal";

export default function InfoConteneur() {
  const { conteneurId } = useParams();
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalMouvementOpen, setIsModalMouvementOpen] = useState(false);

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
      >
        <div className="transport_step">
          <div className="transport_step_container cookie-card">
            <h1 className="tittle">{}</h1>
            <div className="step description">
              <div className="step-container">
                {currentStep === -1 ? (
                  <div className="step-1">
                    <h1>Please select a container</h1>
                    <div className="center">
                      <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                      </div>
                    </div>
                  </div>
                ) : currentStep === 0 ? (
                  <>
                    <h3>location</h3>
                    {selectedCategory === "Import" && <></>}
                    {selectedCategory === "Export" && <></>}
                  </>
                ) : currentStep === 1 ? (
                  <>
                    <h3>transport</h3>

                    {selectedTransport === "Truck" && <></>}

                    {selectedTransport === "Rail" && <></>}
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <h3>validation</h3>
                  </>
                ) : null}
              </div>
              <div className="button_step">
                {currentStep >= 0 && currentStep < 2 && (
                  <div className="step-buttons">
                    {currentStep === 0 ? null : (
                      <button onClick={() => setCurrentStep(currentStep - 1)}>
                        <span className="previous">previous</span>
                      </button>
                    )}
                    <button onClick={() => setCurrentStep(currentStep + 1)}>
                      <span className="next">Next</span>
                    </button>
                  </div>
                )}
                {currentStep === 2 && (
                  <div className="step-buttons">
                    <button onClick={() => setCurrentStep(currentStep - 1)}>
                      <span className="previous">previous</span>
                    </button>
                    <button onClick={() => onSubmit()}>validate</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="transport_step_footer">
            {currentStep >= 0 && (
              <Stepper
                steps={[
                  { title: "location" },
                  { title: "transport" },
                  { title: "validation" },
                ]}
                activeStep={currentStep}
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
