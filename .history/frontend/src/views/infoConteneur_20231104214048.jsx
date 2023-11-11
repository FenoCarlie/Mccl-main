import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import Stepper from "react-stepper-horizontal";
import { iconsImgs } from "../icon/icone";
import Transport from "./Transport";
import { useStateContext } from "../context/ContextProvider";

export default function InfoConteneur() {
  const { conteneurId, projetId } = useParams();
  const [tp, setTp] = useState("");
  const [conteneur, setConteneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTp, setSelectedTp] = useState("");
  const [selectedMouvement, setSelectedMouvement] = useState("");
  const [isModalMouvementOpen, setIsModalMouvementOpen] = useState(false);
  const [selectedTransportCompany, setSelectedTransportCompany] = useState("");
  const [optionTansoprt, setOptionTansport] = useState("");
  const [id_transport, setId_transport] = useState("");
  const [id, setid] = useState("");
  const [clients, setClients] = useState({});
  const [lieu_enlevement_plein, setLieu_enlevement_plein] = useState("");
  const [lieu_enlevement_vide, SetLieu_enlevement_vide] = useState("");
  const [mouvements, setMouvements] = useState({
    id_transport: "",
    id: "",
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
    date_enlevement_plein: "",
    lieu_enlevement_plein: "",
    date_depotage: "",
    lieu_depotage: "",
    date_enlevement_vide: "",
    lieu_enlevement_vide: "",
    date_empotage: "",
    lieu_empotage: "",
    date_restitution: "",
    date_livraison: "",
    lieu_restitution: "",
  });

  const getTp = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/tp")
      .then(({ data }) => {
        setLoading(false);
        const mappedOptionsTp = data.map((item) => ({
          label: item.nom,
          value: item.id,
        }));
        setSelectedTp(mappedOptionsTp);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  console.log(projetId);

  const getClient = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get_client")
      .then(({ data }) => {
        setLoading(false);
        setClients(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

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
          `http://localhost:8081/projet/infoConteneur/${conteneurId}/${projetId}`
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
    getClient();
    getTp();
  }, [conteneurId, projetId]);

  const optionslieu_enlevement = [
    { label: "APL", line: "APL" },
    { label: "Bollore", line: "Bollore" },
    { label: "Leong Tananarivo", line: "Leong Tananarivo" },
    { label: "Medlog", line: "Medlog" },
    { label: "MICTSL", line: "MICTSL" },
    { label: "Salone Tananarivo", line: "Salone Tananarivo" },
    { label: "TL", line: "TL" },
  ];
  const optionslieu_enlevementImpor = [
    { label: "MICTSL", line: "MICTSL" },
    { label: "terre-plein", line: "terre-plein" },
  ];

  const handleSelectTransport = (ev) => {
    setMouvements({ ...mouvements, id_transport: ev.target.value });
    setId_transport(ev.target.value);
  };
  const handleSelectTp = (ev) => {
    setMouvements({ ...mouvements, id: ev.target.value });
    setTp(ev.target.value);
  };

  const handleSelectlieu_enlevementImport = (ev) => {
    setMouvements({ ...mouvements, lieu_enlevement_plein: ev.target.value });
    setLieu_enlevement_plein(ev.target.value);
  };
  const handleSelectlieu_enlevement_plein = (ev) => {
    setMouvements({ ...mouvements, lieu_enlevement_plein: ev.target.value });
    setLieu_enlevement_plein(ev.target.value);
  };
  const handleSelectlieu_enlevement_vide = (ev) => {
    setMouvements({ ...mouvements, lieu_enlevement_vide: ev.target.value });
    SetLieu_enlevement_vide(ev.target.value);
  };

  const customStylesModal = {
    content: {
      top: "350px",
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

  const onSubmit = (ev) => {
    ev.preventDefault();

    const commonData = {
      id_transport: mouvements.id_transport,
      date_depart: mouvements.date_depart,
      date_arriver: mouvements.date_arriver,
      conteneur_id: mouvements.conteneur_id,
      projet_id: mouvements.projet_id,
    };

    if (selectedMouvement === "transport_terrestre") {
      if (conteneur.type_projet === "Import") {
        commonData.num_camion = mouvements.num_camion;
        commonData.num_permis = mouvements.num_permis;
        commonData.nom_chauffeur = mouvements.nom_chauffeur;
        commonData.lieu_enlevement_plein = "MICTSL";
        commonData.date_enlevement_plein = mouvements.date_enlevement_plein;
        commonData.lieu_restitution = mouvements.lieu_restitution;
        commonData.date_restitution = mouvements.date_restitution;
        commonData.lieu_depotage = mouvements.lieu_depotage;
        commonData.date_depotage = mouvements.date_depotage;
      } else if (conteneur.type_projet === "transfert") {
        commonData.num_camion = mouvements.num_camion;
        commonData.num_permis = mouvements.num_permis;
        commonData.nom_chauffeur = mouvements.nom_chauffeur;
        commonData.lieu_enlevement_plein = mouvements.lieu_enlevement_plein;
        commonData.date_enlevement_plein = mouvements.date_enlevement_plein;
        commonData.lieu_restitution = mouvements.lieu_restitution;
        commonData.date_restitution = mouvements.date_restitution;
      } else if (conteneur.type_projet === "Export") {
        commonData.num_camion = mouvements.num_camion;
        commonData.num_permis = mouvements.num_permis;
        commonData.nom_chauffeur = mouvements.nom_chauffeur;
        commonData.lieu_enlevement_vide = mouvements.lieu_enlevement_vide;
        commonData.date_enlevement_vide = mouvements.date_enlevement_vide;
        commonData.date_empotage = mouvements.date_empotage;
        commonData.lieu_empotage = mouvements.lieu_empotage;
        commonData.lieu_livraison = "MICTSL";
        commonData.date_livraison = mouvements.date_livraison;
      }
    } else if (selectedMouvement === "transport_rail") {
      if (conteneur.type_projet === "Import") {
        commonData.num_wagno = mouvements.num_wagno;
        commonData.num_plateforme = mouvements.num_plateforme;
        commonData.lieu_enlevement_plein = "MICTSL";
        commonData.date_enlevement_plein = mouvements.date_enlevement_plein;
        commonData.lieu_restitution = mouvements.lieu_restitution;
        commonData.date_restitution = mouvements.date_restitution;
      } else if (conteneur.type_projet === "transfert") {
        commonData.num_camion = mouvements.num_camion;
        commonData.num_permis = mouvements.num_permis;
        commonData.nom_chauffeur = mouvements.nom_chauffeur;
        commonData.lieu_enlevement_plein = mouvements.lieu_enlevement_plein;
        commonData.date_enlevement_plein = mouvements.date_enlevement_plein;
        commonData.lieu_restitution = mouvements.lieu_restitution;
        commonData.date_restitution = mouvements.date_restitution;
      } else if (conteneur.type_projet === "Export") {
        commonData.num_wagno = mouvements.num_wagno;
        commonData.num_plateforme = mouvements.num_plateforme;
        commonData.lieu_enlevement_vide = mouvements.lieu_enlevement_vide;
        commonData.date_enlevement_vide = mouvements.date_enlevement_vide;
        commonData.date_empotage = mouvements.date_empotage;
        commonData.lieu_empotage = mouvements.lieu_empotage;
        commonData.lieu_livraison = "MICTSL";
        commonData.date_livraison = mouvements.date_livraison;
      }
    }

    axios
      .post(`http://localhost:8081/create/${selectedUrl}`, commonData)
      .then(() => {
        setNotification("Le mouvement a été effectué avec succès");
        setLoading(true);
        setErrors({});
        setIsModalMouvementOpen(false);
      })
      .catch((error) => {
        console.error(`Erreur lors de la création du mouvement :`, error);
      });
  };

  const urlMappings = {
    transport_terrestre: {
      Import: "transport_terrestre/import",
      transfert: "transport_terrestre/transfert",
      Export: "transport_terrestre/export",
    },
    transport_rail: {
      Import: "transport_rail/import",
      transfert: "transport_rail/transfert",
      Export: "transport_rail/export",
    },
  };

  const selectedUrl = urlMappings.transport_terrestre.Import;

  console.log(selectedUrl);

  return (
    <div className="conteneur">
      <div className="">
        <h1 className="align">Information Conteneur</h1>
      </div>
      <div className="align">
        <div>
          {loading ? (
            <p>Chargement en cours...</p>
          ) : (
            <div>
              {console.log(mouvements)}
              <div className="card-info Wh">
                <div className="bannier">
                  <div className="card-header">
                    <h3>Information conteneur</h3>
                  </div>
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
          <div className="transport_step_container">
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
                      <>
                        <div>
                          {(conteneur.type_projet === "Import" ||
                            conteneur.type_projet === "transfert") && (
                            <>
                              <div className="align">
                                {conteneur.type_projet === "transfert" && (
                                  <div className="input-container">
                                    <label
                                      htmlFor="loc_pick_up_full"
                                      className="input-label"
                                    >
                                      Lieu d'enlevement plain
                                    </label>
                                    <select
                                      className="input-field"
                                      value={lieu_enlevement_plein}
                                      onChange={
                                        handleSelectlieu_enlevement_plein
                                      }
                                      id="lieu_enlevement"
                                    >
                                      <option
                                        value=""
                                        disabled
                                        hidden
                                        className=""
                                        style={{ color: "gray" }}
                                      >
                                        Lieu d'enlevement plain
                                      </option>
                                      {optionslieu_enlevement.map((option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                          className="custom-option"
                                        >
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                    <span className="input-highlight"></span>
                                  </div>
                                )}
                                {conteneur.type_projet === "import" && (
                                  <div className="input-container">
                                    <label
                                      htmlFor="loc_pick_up_full"
                                      className="input-label"
                                    >
                                      Lieu d'enlevement plain
                                    </label>
                                    <select
                                      className="input-field"
                                      value={lieu_enlevement_plein}
                                      onChange={
                                        handleSelectlieu_enlevementImport
                                      }
                                      id="lieu_enlevement"
                                    >
                                      <option
                                        value=""
                                        disabled
                                        hidden
                                        className=""
                                        style={{ color: "gray" }}
                                      >
                                        Lieu d'enlevement plain
                                      </option>
                                      {optionslieu_enlevementImpor.map(
                                        (option) => (
                                          <option
                                            key={option.value}
                                            value={option.value}
                                            className="custom-option"
                                          >
                                            {option.label}
                                          </option>
                                        )
                                      )}
                                    </select>
                                    <span className="input-highlight"></span>
                                  </div>
                                )}

                                <div className="input-container">
                                  <label
                                    htmlFor="date_enlevement_plein"
                                    className="input-label"
                                  >
                                    Date d'enlevement plain
                                  </label>
                                  <input
                                    placeholder="pick-up date full"
                                    className="input-field"
                                    type="date"
                                    value={mouvements.date_enlevement_plein}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        date_enlevement_plein: ev.target.value,
                                      })
                                    }
                                    id="date_enlevement_plein"
                                  />
                                  <span className="input-highlight"></span>
                                </div>
                              </div>
                              <div className="align">
                                <div className="input-container">
                                  <label
                                    htmlFor="Depotage"
                                    className="input-label"
                                  >
                                    Lieu de depotage
                                  </label>
                                  <input
                                    placeholder="Lieu de depotage"
                                    className="input-field"
                                    type="text"
                                    value={mouvements.lieu_depotage}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        lieu_depotage: ev.target.value,
                                      })
                                    }
                                    id="lieu_depotage"
                                  />
                                </div>
                                <div className="input-container">
                                  <label
                                    htmlFor="date_depotage"
                                    className="input-label"
                                  >
                                    Date de depotage
                                  </label>
                                  <input
                                    placeholder="pick-up date full"
                                    className="input-field"
                                    type="date"
                                    value={mouvements.date_depotage}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        date_depotage: ev.target.value,
                                      })
                                    }
                                    id="date_depotage"
                                  />
                                  <span className="input-highlight"></span>
                                </div>
                              </div>
                              <div className="align">
                                <div className="input-container">
                                  <label
                                    htmlFor="lieu_restitution"
                                    className="input-label"
                                  >
                                    Lieu de restiturtion
                                  </label>
                                  <input
                                    placeholder="Lieu de depotage"
                                    className="input-field"
                                    type="text"
                                    value={mouvements.lieu_restitution}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        lieu_restitution: ev.target.value,
                                      })
                                    }
                                    id="lieu_restitution"
                                  />
                                </div>
                                <div className="input-container">
                                  <label
                                    htmlFor="date_restitution"
                                    className="input-label"
                                  >
                                    Date de restitution
                                  </label>
                                  <input
                                    placeholder="pick-up date full"
                                    className="input-field"
                                    type="date"
                                    value={mouvements.date_restitution}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        date_restitution: ev.target.value,
                                      })
                                    }
                                    id="date_restitution"
                                  />
                                  <span className="input-highlight"></span>
                                </div>
                              </div>
                            </>
                          )}
                          {conteneur.type_projet === "Export" && (
                            <>
                              <div className="align">
                                <div className="input-container">
                                  <label
                                    htmlFor="lieu_enlevement_vide"
                                    className="input-label"
                                  >
                                    Lieu d'enlevement vide
                                  </label>
                                  <select
                                    className="input-field"
                                    value={lieu_enlevement_vide}
                                    onChange={handleSelectlieu_enlevement_vide}
                                    id="lieu_enlevement_vide"
                                  >
                                    <option
                                      value=""
                                      disabled
                                      hidden
                                      className=""
                                      style={{ color: "gray" }}
                                    >
                                      Lieu d'enlevement vide
                                    </option>
                                    {optionslieu_enlevement.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                        className="custom-option"
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="input-highlight"></span>
                                </div>
                                <div className="input-container">
                                  <label
                                    htmlFor="date_enlevement_vide"
                                    className="input-label"
                                  >
                                    Date d'enlevement vide
                                  </label>
                                  <input
                                    placeholder="Date d'enlevement vide"
                                    className="input-field"
                                    type="date"
                                    value={mouvements.date_enlevement_vide}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        date_enlevement_vide: ev.target.value,
                                      })
                                    }
                                    id="date_enlevement_vide"
                                  />
                                  <span className="input-highlight"></span>
                                </div>
                              </div>
                              <div className="align">
                                <div className="input-container">
                                  <label
                                    htmlFor="empotage"
                                    className="input-label"
                                  >
                                    Lieu d'empotage
                                  </label>
                                  <input
                                    placeholder="Lieu d'empotage"
                                    className="input-field"
                                    type="text"
                                    value={mouvements.lieu_empotage}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        lieu_empotage: ev.target.value,
                                      })
                                    }
                                    id="lieu_empotage"
                                  />
                                </div>
                                <div className="input-container">
                                  <label
                                    htmlFor="date_empotage"
                                    className="input-label"
                                  >
                                    Date d'empotage
                                  </label>
                                  <input
                                    placeholder="Date d'empotage"
                                    className="input-field"
                                    type="date"
                                    value={mouvements.date_empotage}
                                    onChange={(ev) =>
                                      setMouvements({
                                        ...mouvements,
                                        date_empotage: ev.target.value,
                                      })
                                    }
                                    id="date_empotage"
                                  />
                                  <span className="input-highlight"></span>
                                </div>
                              </div>
                              <div className="input-container">
                                <label
                                  htmlFor="date_empotage"
                                  className="input-label"
                                >
                                  Date de livraison
                                </label>
                                <input
                                  placeholder="Date de livraison"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_empotage}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_empotage: ev.target.value,
                                    })
                                  }
                                  id="date_empotage"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </>
                          )}
                          <div className="step-field">
                            <div className="align">
                              <div className="input-container">
                                <label
                                  htmlFor="transport"
                                  className="input-label"
                                >
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
                                <label
                                  htmlFor="num_camion"
                                  className="input-label"
                                >
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
                            </div>
                            <div className="align">
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
                                  htmlFor="num_permis"
                                  className="input-label"
                                >
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
                            </div>
                            <div className="align">
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
                                  id="date_depart"
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
                                  id="date_arriver"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedMouvement === "transport_rail" && (
                      <div>
                        {(conteneur.type_projet === "Import" ||
                          conteneur.type_projet === "transfert") && (
                          <>
                            <div className="align">
                              {conteneur.type_projet === "transfert" && (
                                <div className="input-container">
                                  <label
                                    htmlFor="loc_pick_up_full"
                                    className="input-label"
                                  >
                                    Lieu d'enlevement plain
                                  </label>
                                  <select
                                    className="input-field"
                                    value={lieu_enlevement_plein}
                                    onChange={handleSelectlieu_enlevement_plein}
                                    id="lieu_enlevement"
                                  >
                                    <option
                                      value=""
                                      disabled
                                      hidden
                                      className=""
                                      style={{ color: "gray" }}
                                    >
                                      Lieu d'enlevement plain
                                    </option>
                                    {optionslieu_enlevement.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                        className="custom-option"
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <span className="input-highlight"></span>
                                </div>
                              )}
                              {conteneur.type_projet === "Import" && (
                                <div className="input-container">
                                  <label
                                    htmlFor="loc_pick_up_full"
                                    className="input-label"
                                  >
                                    Lieu d'enlevement plain
                                  </label>
                                  <select
                                    className="input-field"
                                    value={lieu_enlevement_plein}
                                    onChange={handleSelectlieu_enlevementImport}
                                    id="lieu_enlevement"
                                  >
                                    <option
                                      value=""
                                      disabled
                                      hidden
                                      className=""
                                      style={{ color: "gray" }}
                                    >
                                      Lieu d'enlevement plain
                                    </option>
                                    {optionslieu_enlevementImpor.map(
                                      (option) => (
                                        <option
                                          key={option.value}
                                          value={option.value}
                                          className="custom-option"
                                        >
                                          {option.label}
                                        </option>
                                      )
                                    )}
                                  </select>
                                  <span className="input-highlight"></span>
                                </div>
                              )}

                              <div className="input-container">
                                <label
                                  htmlFor="date_enlevement_plein"
                                  className="input-label"
                                >
                                  Date d'enlevement plain
                                </label>
                                <input
                                  placeholder="pick-up date full"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_enlevement_plein}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_enlevement_plein: ev.target.value,
                                    })
                                  }
                                  id="date_enlevement_plein"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                            <div className="align">
                              <div className="input-container">
                                <label
                                  htmlFor="Depotage"
                                  className="input-label"
                                >
                                  Lieu de depotage
                                </label>
                                <input
                                  placeholder="Lieu de depotage"
                                  className="input-field"
                                  type="text"
                                  value={mouvements.lieu_depotage}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      lieu_depotage: ev.target.value,
                                    })
                                  }
                                  id="lieu_depotage"
                                />
                              </div>
                              <div className="input-container">
                                <label
                                  htmlFor="date_depotage"
                                  className="input-label"
                                >
                                  Date de depotage
                                </label>
                                <input
                                  placeholder="pick-up date full"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_depotage}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_depotage: ev.target.value,
                                    })
                                  }
                                  id="date_depotage"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                            <div className="align">
                              <div className="input-container">
                                <label
                                  htmlFor="lieu_restitution"
                                  className="input-label"
                                >
                                  Lieu de restiturtion
                                </label>
                                <input
                                  placeholder="Lieu de depotage"
                                  className="input-field"
                                  type="text"
                                  value={mouvements.lieu_restitution}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      lieu_restitution: ev.target.value,
                                    })
                                  }
                                  id="lieu_restitution"
                                />
                              </div>
                              <div className="input-container">
                                <label
                                  htmlFor="date_restitution"
                                  className="input-label"
                                >
                                  Date de restitution
                                </label>
                                <input
                                  placeholder="pick-up date full"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_restitution}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_restitution: ev.target.value,
                                    })
                                  }
                                  id="date_restitution"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                          </>
                        )}
                        {conteneur.type_projet === "Export" && (
                          <>
                            <div className="align">
                              <div className="input-container">
                                <label
                                  htmlFor="lieu_enlevement_vide"
                                  className="input-label"
                                >
                                  Lieu d'enlevement vide
                                </label>
                                <select
                                  className="input-field"
                                  value={lieu_enlevement_vide}
                                  onChange={handleSelectlieu_enlevement_vide}
                                  id="lieu_enlevement_vide"
                                >
                                  <option
                                    value=""
                                    disabled
                                    hidden
                                    className=""
                                    style={{ color: "gray" }}
                                  >
                                    Lieu d'enlevement vide
                                  </option>
                                  {optionslieu_enlevement.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                      className="custom-option"
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <span className="input-highlight"></span>
                              </div>
                              <div className="input-container">
                                <label
                                  htmlFor="date_enlevement_vide"
                                  className="input-label"
                                >
                                  Date d'enlevement vide
                                </label>
                                <input
                                  placeholder="Date d'enlevement vide"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_enlevement_vide}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_enlevement_vide: ev.target.value,
                                    })
                                  }
                                  id="date_enlevement_vide"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                            <div className="align">
                              <div className="input-container">
                                <label
                                  htmlFor="empotage"
                                  className="input-label"
                                >
                                  Lieu d'empotage
                                </label>
                                <input
                                  placeholder="Lieu d'empotage"
                                  className="input-field"
                                  type="text"
                                  value={mouvements.lieu_empotage}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      lieu_empotage: ev.target.value,
                                    })
                                  }
                                  id="lieu_empotage"
                                />
                              </div>
                              <div className="input-container">
                                <label
                                  htmlFor="date_empotage"
                                  className="input-label"
                                >
                                  Date d'empotage
                                </label>
                                <input
                                  placeholder="Date d'empotage"
                                  className="input-field"
                                  type="date"
                                  value={mouvements.date_empotage}
                                  onChange={(ev) =>
                                    setMouvements({
                                      ...mouvements,
                                      date_empotage: ev.target.value,
                                    })
                                  }
                                  id="date_empotage"
                                />
                                <span className="input-highlight"></span>
                              </div>
                            </div>
                            <div className="input-container">
                              <label
                                htmlFor="date_empotage"
                                className="input-label"
                              >
                                Date de livraison
                              </label>
                              <input
                                placeholder="Date d'empotage"
                                className="input-field"
                                type="date"
                                value={mouvements.date_livraison}
                                onChange={(ev) =>
                                  setMouvements({
                                    ...mouvements,
                                    date_livraison: ev.target.value,
                                  })
                                }
                                id="date_livraison"
                              />
                              <span className="input-highlight"></span>
                            </div>
                          </>
                        )}
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
                        <div className="align">
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
                      </div>
                    )}
                    {selectedMouvement === "stockage" && (
                      <div>
                        <h1>stockage</h1>

                        <div className="input-container">
                          <label htmlFor="tp" className="input-label">
                            Terre plain
                          </label>
                          <select
                            className="input-field"
                            value={id}
                            onChange={handleSelectTp}
                          >
                            <option
                              value=""
                              disabled
                              hidden
                              style={{ color: "gray" }}
                            >
                              Transport company
                            </option>
                            {selectedTp.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                ) : currentStep === 2 ? (
                  <>
                    {selectedMouvement === "transport_terrestre" && (
                      <>
                        <div>
                          {(conteneur.type_projet === "Import" ||
                            conteneur.type_projet === "transfert") && (
                            <>
                              <div className="align">
                                {conteneur.type_projet === "transfert" && <></>}
                                {conteneur.type_projet === "import" && <></>}
                              </div>
                            </>
                          )}
                          {conteneur.type_projet === "Export" && <></>}
                        </div>
                      </>
                    )}

                    {selectedMouvement === "transport_rail" && (
                      <div>
                        {(conteneur.type_projet === "Import" ||
                          conteneur.type_projet === "transfert") && (
                          <>
                            <div className="align">
                              {conteneur.type_projet === "transfert" && <></>}
                              {conteneur.type_projet === "Import" && <></>}
                            </div>
                          </>
                        )}
                        {conteneur.type_projet === "Export" && <></>}
                      </div>
                    )}
                    {selectedMouvement === "stockage" && (
                      <div>
                        <h1>stockage</h1>
                      </div>
                    )}
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
                      <button>valier</button>
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
