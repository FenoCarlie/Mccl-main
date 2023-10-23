import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [projet, setProjet] = useState(null);
  const [conteneurs, setConteneurs] = useState([]);
  const { setNotification } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isModalConteneurOpen, setIsModalConteneurOpen] = useState(false);
  const [conteneur, setConteneur] = useState({
    projet_id: "",
    num_conteneur: "",
    line: "",
    type: "",
    tare: "",
  });

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

  const [type, setType] = useState("");
  const [line, setLine] = useState("");

  const optionsType = [
    { label: "20' Dry Standard", type: "20' Dry Standard" },
    { label: "20' Dry ventilé", type: "20' Dry ventilé" },
    { label: "20' Open Top", type: "20' Open Top" },
    { label: "20' Flat Rack", type: "20' Flat Rack" },
    { label: "20' Reefer", type: "20' Reefer" },
    { label: "20' Tank", type: "20' Tank" },
    { label: "20' Open Side", type: "20' Open Side" },
    { label: "40' Dry Standard", type: "40' Dry Standard" },
    { label: "40' High Cube (HC)", type: "40' High Cube (HC)" },
    { label: "40' Dry ventilé", type: "40' Dry ventilé" },
    { label: "40' Open Top", type: "40' Open Top" },
    { label: "40' Flat Rack", type: "40' Flat Rack" },
    { label: "40' Reefer", type: "40' Reefer" },
    { label: "40' Tank", type: "40' Tank" },
    { label: "40' Open Side", type: "40' Open Side" },
    { label: "40' Double Door", type: "40' Double Door" },
    { label: "40' High Cube Palletwide", type: "40' High Cube Palletwide" },
    { label: "40' Open Top Hard Top", type: "40' Open Top Hard Top" },
  ];

  const optionsLine = [
    { label: "APL", line: "APL" },
    { label: "CMA CGM ", line: "CMA CGM " },
    { label: "Cosco Shipping Lines ", line: "Cosco Shipping Lines " },
    { label: "Evergreen Line ", line: "Evergreen Line " },
    { label: "GL", line: "GL" },
    { label: "Hamburg Süd", line: "Hamburg Süd" },
    { label: "LA SEAL", line: "LA SEAL" },
    { label: "Maersk Line ", line: "Maersk Line " },
    { label: "MSC", line: "MSC" },
    { label: "PIL", line: "PIL" },
  ];

  const handleSelectType = (ev) => {
    setType(ev.target.value);
    setConteneur((prevConteneur) => ({
      ...prevConteneur,
      type: ev.target.value,
    }));
  };

  const handleSelectLine = (ev) => {
    setConteneur({ ...conteneur, line: ev.target.value });
    setLine(ev.target.value);
  };

  const [numConteneurError, setNumConteneurError] = useState("");

  const handleNumConteneurChange = (ev) => {
    let inputValue = ev.target.value;

    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
    }

    if (inputValue.length !== 11) {
      setNumConteneurError("Must be 11 characters long.");
    } else if (!/^[A-Za-z]{4}\d{7}$/.test(inputValue)) {
      setNumConteneurError("Must begin with 4 letters followed by 7 digits.");
    } else {
      setNumConteneurError("");
    }
    setConteneur({ ...conteneur, num_conteneur: ev.target.value });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/conteneur", {
        projet_id: projetId,
        num_conteneur: conteneur.num_conteneur,
        line: conteneur.line,
        tare: conteneur.tare,
        type: conteneur.type,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setLoading(true);
        setErrors({});
        setIsModalConteneurOpen(false);
        getConteneur(projetId);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };

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
                  <h2>{conteneur.num_conteneur}</h2>
                  <label className="">
                    {conteneur.status === 1 ? (
                      <Link
                        to={`/client/infoClient/infoProjet/infoConteneur/${conteneur.id}`}
                      >
                        Terminer
                      </Link>
                    ) : (
                      <Link
                        to={`/client/infoClient/infoProjet/infoConteneur/${conteneur.id}`}
                      >
                        Actif
                      </Link>
                    )}
                  </label>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Line :</strong>
                  </p>
                  <p>{conteneur.line}</p>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Localisation :</strong>
                  </p>
                  <p>{}</p>
                </div>
                <div className="align contenue">
                  <p>
                    <strong>Position :</strong>
                  </p>
                  <p>{}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Modal
        isOpen={isModalConteneurOpen}
        onRequestClose={() => setIsModalConteneurOpen(false)}
        contentLabel="Projet Modal"
        style={customStylesModal}
      >
        <h2>Ajout Conteneur</h2>

        <div className="">
          <div className="input-container">
            <label htmlFor="num_container" className="input-label">
              Numero conteneur
            </label>
            <input
              placeholder="Numero conteneur"
              className="input-field"
              type="text"
              value={conteneur.num_conteneur}
              onChange={handleNumConteneurChange}
              id="conteneur"
              maxLength="11"
            />
            <span className="input-highlight"></span>
            {numConteneurError && (
              <span className="input-error-message">{numConteneurError}</span>
            )}
          </div>

          <div className="input-container">
            <label htmlFor="line" className="input-label">
              Line
            </label>
            <select
              className="input-field"
              value={line}
              onChange={handleSelectLine}
              id="line"
            >
              <option value="" disabled hidden style={{ color: "gray" }}>
                Line
              </option>
              {optionsLine.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="input-highlight"></span>
          </div>
        </div>

        <div className="">
          <div className="input-container">
            <label htmlFor="type" className="input-label">
              Type
            </label>
            <select
              className="input-field"
              value={type}
              onChange={handleSelectType}
              id="type"
            >
              <option value="" disabled hidden style={{ color: "gray" }}>
                Type
              </option>
              {optionsType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="input-highlight"></span>
          </div>

          <div className="input-container">
            <label htmlFor="tare" className="input-label">
              Tare
            </label>
            <input
              placeholder="Tare"
              className="input-field"
              type="text"
              value={conteneur.tare}
              onChange={(ev) =>
                setConteneur({ ...conteneur, tare: ev.target.value })
              }
              id="tare" // Ajoutez un id unique
            />
            <span className="input-highlight"></span>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <button className="btn">Save</button>
        </form>
      </Modal>
    </div>
  );
}
