import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Stepper from "react-stepper-horizontal";
import { iconsImgs } from "../icon/icone";
import Transport from "./Transport";
import { useStateContext } from "../context/ContextProvider";

export default function InfoConteneur() {
  const { conteneurId } = useParams();
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTransport, setSelectedTransport] = useState("");
  const [selectedMouvement, setSelectedMouvement] = useState("");
  const [isModalMouvementOpen, setIsModalMouvementOpen] = useState(false);
  const [selectedTransportCompany, setSelectedTransportCompany] = useState("");
  const [optionTansoprt, setOptionTansport] = useState("");
  const [id_transport, setId_transport] = useState("");
  const [mouvements, setMouvements] = useState({
    id_transport: "",
    projet_id: "",
    date_depart: "",
    date_arriver: "",
    conteneur_id: "",
    num_camion: "",
    num_permis: "",
    nom_chauffeur: "",
    num_wagno: "",
    num_plateforme: "",
    date_debut_stockage: "",
  });

  const getTransport = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/transport")
      .then(({ data }) => {
        setLoading(false);
        const mappedOptions = data.map((item) => ({
          label: item.company,
          value: item.id_transport,
        }));
        setSelectedTransportCompany(mappedOptions);
      })
      .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
      });
  };

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
    getTransport();
  }, [conteneurId]);

  const handleSelectTypeTransport = (ev) => {
    setSelectedTransportCompany(ev.target.value);
  };
  const handleSelectTransport = (ev) => {
    setMouvements({ ...mouvements, id_transport: ev.target.value });
    setId_transport(ev.target.value);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (selectedMouvement === "transport_terrestre") {
      axios
        .post("http://localhost:8081/creat/transport_terrestre", {
          id_transport: mouvements.id_transport,
          date_depart: mouvements.date_depart,
          date_arriver: mouvements.date_arriver,
          conteneur_id: mouvements.conteneur_id,
          projet_id: mouvements.projet_id,
          num_camion: mouvements.num_camion,
          num_permis: mouvements.num_permis,
          nom_chauffeur: mouvements.nom_chauffeur,
        })
        .then(() => {
          setNotification("Le mouvement a été effectué avec succès");
          setLoading(true);
          setErrors({});
          setIsModalMouvementOpen(false);
        })
        .catch((error) => {
          // Gérez les erreurs ici, par exemple, en utilisant setErrors pour afficher des erreurs
          console.error(
            "Erreur lors de la création du mouvement terrestre :",
            error
          );
        });
    } else if (selectedMouvement === "transport_rail") {
      axios
        .post("http://localhost:8081/creat/transport_rail", {
          id_transport: mouvements.id_transport,
          date_depart: mouvements.date_depart,
          date_arriver: mouvements.date_arriver,
          conteneur_id: mouvements.conteneur_id,
          projet_id: mouvements.projet_id,
          num_wagno: mouvements.num_wagno,
          num_plateforme: mouvements.num_plateforme,
        })
        .then(() => {
          setNotification("Le mouvement a été effectué avec succès");
          setLoading(true);
          setErrors({});
          setIsModalMouvementOpen(false);
        })
        .catch((error) => {
          // Gérez les erreurs ici, par exemple, en utilisant setErrors pour afficher des erreurs
          console.error(
            "Erreur lors de la création du mouvement par rail :",
            error
          );
        });
    } else {
      axios
        .post("http://localhost:8081/creat/autre_mouvement", {
          date_debut_stockage: "",
          conteneur_id: mouvements.conteneur_id,
          projet_id: mouvements.projet_id,
        })
        .then(() => {
          setNotification("Le mouvement a été effectué avec succès");
          setLoading(true);
          setErrors({});
          setIsModalMouvementOpen(false);
        })
        .catch((error) => {
          // Gérez les erreurs ici, par exemple, en utilisant setErrors pour afficher des erreurs
          console.error(
            "Erreur lors de la création d'un autre mouvement :",
            error
          );
        });
    }
  };

  const customStylesModal = {
    content: {
      top: "40%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "650px",
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
                    <h1>Type de mouvement</h1>
                    <div className="button-mouvement">
                      <button
                        className="continue-application"
                        onClick={() => {
                          setCurrentStep(currentStep + 1);
                          setSelectedMouvement("transport_terrestre");
                          setOptionTansport("Truck");
                        }}
                      >
                        <span className="button__text">
                          Transport terrestre
                        </span>
                      </button>
                      <button
                        className="continue-application"
                        onClick={() => {
                          setCurrentStep(currentStep + 1);
                          setSelectedMouvement("transport_rail");
                          setOptionTansport("Rail");
                        }}
                      >
                        <span className="button__text">Transport rail</span>
                      </button>
                      <button
                        className="continue-application"
                        onClick={() => {
                          setCurrentStep(currentStep + 1);
                          setSelectedMouvement("stockage");
                        }}
                      >
                        <span className="button__text">Stockage</span>
                      </button>
                    </div>
                  </>
                ) : currentStep === 1 ? (
                  <>
                    {selectedMouvement === "transport_terrestre" && (
                      <div>
                        <h1>Transport terrestre</h1>
                        <>
                          <div className="input-container">
                            <label htmlFor="transport" className="input-label">
                              Transport
                            </label>
                            <select
                              className="input-field"
                              value={id_transport}
                              onChange={handleSelectTransport}
                            >
                              <option
                                value=""
                                disabled
                                hidden
                                style={{ color: "gray" }}
                              >
                                Transport company
                              </option>
                              {selectedTransportCompany.map((option) =>
                                optionTansoprt === "Truck" &&
                                option.label !== "Madarail" ? (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ) : null
                              )}
                            </select>
                          </div>
                          <div className="input-container">
                            <label htmlFor="num_camion" className="input-label">
                              Numero du camion
                            </label>
                            <input
                              placeholder="Numero du camion"
                              className="input-field"
                              type="text"
                              value={mouvements.num_camion}
                              onChange={(ev) =>
                                setMouvements({
                                  ...mouvements,
                                  num_camion: ev.target.value,
                                })
                              }
                              id="num_camion" // Ajoutez un id unique
                            />
                            <span className="input-highlight"></span>
                          </div>
                          <div className="input-container">
                            <label htmlFor="num_permis" className="input-label">
                              Permis de conduire
                            </label>
                            <input
                              placeholder="Permis de conduire"
                              className="input-field"
                              type="text"
                              value={mouvements.num_permis}
                              onChange={(ev) =>
                                setMouvements({
                                  ...mouvements,
                                  num_permis: ev.target.value,
                                })
                              }
                              id="num_permis" // Ajoutez un id unique
                            />
                            <span className="input-highlight"></span>
                          </div>
                          <div className="input-container">
                            <label
                              htmlFor="nom_chauffeur"
                              className="input-label"
                            >
                              Nom du chauffeur
                            </label>
                            <input
                              placeholder="Nom du chauffeur"
                              className="input-field"
                              type="text"
                              value={mouvements.nom_chauffeur}
                              onChange={(ev) =>
                                setMouvements({
                                  ...mouvements,
                                  nom_chauffeur: ev.target.value,
                                })
                              }
                              id="nom_chauffeur" // Ajoutez un id unique
                            />
                            <span className="input-highlight"></span>
                          </div>
                          <div className="input-container">
                            <label
                              htmlFor="date_depart"
                              className="input-label"
                            >
                              Date de depart
                            </label>
                            <input
                              placeholder="Date de depart"
                              className="input-field"
                              type="date"
                              value={mouvements.date_depart}
                              onChange={(ev) =>
                                setMouvements({
                                  ...mouvements,
                                  date_depart: ev.target.value,
                                })
                              }
                              id="date_depart" // Ajoutez un id unique
                            />
                            <span className="input-highlight"></span>
                          </div>
                          <div className="input-container">
                            <label
                              htmlFor="date_arriver"
                              className="input-label"
                            >
                              Date d'arriver
                            </label>
                            <input
                              placeholder="Date de depart"
                              className="input-field"
                              type="date"
                              value={mouvements.date_arriver}
                              onChange={(ev) =>
                                setMouvements({
                                  ...mouvements,
                                  date_arriver: ev.target.value,
                                })
                              }
                              id="date_arriver" // Ajoutez un id unique
                            />
                            <span className="input-highlight"></span>
                          </div>
                        </>
                      </div>
                    )}

                    {selectedMouvement === "transport_rail" && (
                      <div>
                        <h1>Transport rail</h1>
                        <div className="input-container">
                          <label htmlFor="transport" className="input-label">
                            Transport
                          </label>
                          <select
                            className="input-field"
                            value={id_transport}
                            onChange={handleSelectTransport}
                          >
                            <option
                              value=""
                              disabled
                              hidden
                              style={{ color: "gray" }}
                            >
                              Transport company
                            </option>
                            {selectedTransportCompany.map((option) =>
                              optionTansoprt === "Rail" &&
                              option.label == "Madarail" ? (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ) : null
                            )}
                          </select>
                        </div>
                        <div className="input-container">
                          <label htmlFor="num_wagno" className="input-label">
                            Numero du wagno
                          </label>
                          <input
                            placeholder="Numero du wagno"
                            className="input-field"
                            type="text"
                            value={mouvements.num_wagno}
                            onChange={(ev) =>
                              setMouvements({
                                ...mouvements,
                                num_wagno: ev.target.value,
                              })
                            }
                            id="num_wagno" // Ajoutez un id unique
                          />
                          <span className="input-highlight"></span>
                        </div>
                        <div className="input-container">
                          <label
                            htmlFor="num_plateforme"
                            className="input-label"
                          >
                            Numero du plateforme
                          </label>
                          <input
                            placeholder="Numero du plateforme"
                            className="input-field"
                            type="text"
                            value={mouvements.num_plateforme}
                            onChange={(ev) =>
                              setMouvements({
                                ...mouvements,
                                num_plateforme: ev.target.value,
                              })
                            }
                            id="num_plateforme" // Ajoutez un id unique
                          />
                          <span className="input-highlight"></span>
                        </div>
                      </div>
                    )}
                    {selectedMouvement === "stockage" && (
                      <div>
                        <h1>stockage</h1>
                      </div>
                    )}
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
                    <form onSubmit={onSubmit}>
                      <button className="btn">valier</button>
                    </form>
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
