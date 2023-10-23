import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Stepper from "react-stepper-horizontal";
import { iconsImgs } from "../icon/icone";

export default function InfoConteneur() {
  const { conteneurId } = useParams();
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedMouvement, setSelectedMouvement] = useState("");
  const [isModalMouvementOpen, setIsModalMouvementOpen] = useState(false);

  useEffect(() => {
    const getConteneur = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/conteneur/${conteneurId}`
        );
        setConteneur(response.data[0]);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération du conteneur :", error);
        setLoading(false);
      }
    };
    getConteneur();
  }, [conteneurId]);

  const customStylesModal = {
    content: {
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",

      borderRadius: "15px",
    },
    overlay: {
      backgroundColor: "rgba(189, 189, 189, 0.75)",
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
                {currentStep === 0 ? (
                  <>
                    <h3>Type de mouvement</h3>
                    <div className="button-mouvement">
                      <button
                        className="continue-application"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        <span className="button__text">Empotage</span>
                        <span className="button__icon">
                          <img
                            src={iconsImgs.container}
                            alt=""
                            className="nav-link-icon"
                          />
                        </span>
                      </button>
                      <button onClick={() => setCurrentStep(currentStep + 1)}>
                        <img
                          src={iconsImgs.container}
                          alt=""
                          className="nav-link-icon"
                        />
                        Depotage
                      </button>
                      <button onClick={() => setCurrentStep(currentStep + 1)}>
                        <img
                          src={iconsImgs.container}
                          alt=""
                          className="nav-link-icon"
                        />
                        Shifting
                      </button>
                    </div>
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
                {currentStep >= 1 && currentStep < 2 && (
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
                    <button>validate</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="transport_step_footer">
            {currentStep >= 0 && (
              <Stepper
                steps={[
                  { title: "Mouvement" },
                  { title: "transport/Emplacement" },
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
