import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useStateContext } from "../context/ContextProvider.jsx";
import Modal from "react-modal";

export default function InfoClient() {
  const { clientId } = useParams();
  const [client, setClient] = useState({});
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [isModalProjetOpen, setIsModalProjetOpen] = useState(false);
  const [isModalClientOpen, setIsModalClientOpen] = useState(false);
  const [projet, setProjet] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
    type: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/projet", {
        client_projet: projet.client_id,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
        type: projet.type,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalProjetOpen(false);
        setErrors({});
        getProjets(clientId);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };

  const getClient = (clientId) => {
    axios
      .get(`http://localhost:8081/client/${clientId}`)
      .then(({ data }) => {
        setClient(data[0]);
        setLoading(false);
        setProjet({
          ...projet,
          client_projet: data[0].nom,
          client_id: data[0].id,
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération du client :", error);
        setLoading(false);
      });
  };

  console.log(projet.client_id);

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

  const [type, setType] = useState("");
  const optionsTypeProjet = [
    { label: "Import", type: "import" },
    { label: "Export", type: "export" },
    { label: "Transfert", type: "transfert" },
    { label: "Stockage", type: "stockage" },
  ];

  const handleSelectType = (ev) => {
    setProjet({ ...projet, type: ev.target.value });
    setType(ev.target.value);
  };

  const onClientUpdate = (ev) => {
    ev.preventDefault();

    const updatedClient = {
      id: client.id,
      nom: client.nom,
      contacte: client.contacte,
      adresse: client.adresse,
      email: client.email,
    };

    axios
      .put(`http://localhost:8081/update/client/${client.id}`, updatedClient)
      .then(() => {
        setNotification("Le client a été mis à jour avec succès");
        setIsModalClientOpen(false);
        setErrors({});
        getClient(clientId);
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };

  useEffect(() => {
    getClient(clientId);
    getProjets(clientId);
  }, [clientId]);

  const customStylesModal = {
    content: {
      top: "20%",
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
  const customStylesModalClient = {
    content: {
      top: "25%",
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
    <div className="client">
      <h1>InfoClient</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div>{/* ... Afficher les détails du client ... */}</div>
          <div className="min-card">
            {projets.length === 0 ? (
              // Aucun projet
              <div className="card projet-info-container">
                <div className="align projet-info-header contenue">
                  <h2>Aucun projet</h2>
                </div>
              </div>
            ) : (
              // Afficher les détails de chaque projet
              projets.map((projet) => (
                <div
                  className={` card projet-info-container ${
                    projets.status === 1 ? "true-bg" : "false-bg"
                  }`}
                  key={projet.id}
                >
                  <div className="align projet-info-header contenue">
                    <h2>{projets.nom_projet}</h2>
                    <label className="">
                      {projets.status === 1 ? (
                        <Link to={`/client/infoClient/infoProjet/${projet.id}`}>
                          Terminer
                        </Link>
                      ) : (
                        <Link to={`/client/infoClient/infoProjet/${projet.id}`}>
                          Actif
                        </Link>
                      )}
                    </label>
                  </div>
                  <div className="align contenue">
                    <p>
                      <strong>Numero Booking :</strong>
                    </p>
                    <p>{projets.num_booking}</p>
                  </div>
                  <div className="align contenue">
                    <p>
                      <strong>Nombre de conteneur :</strong>
                    </p>
                    <p>{projets.totalConteneurs}</p>
                  </div>
                  {projets.status === 0 ? (
                    <>
                      <div className="align contenue">
                        <p>
                          <strong>Conteneur Actif:</strong>
                        </p>
                        <p>{projets.conteneursActifs}</p>
                      </div>
                      <div className="align contenue">
                        <p>
                          <strong>Conteneur Terminé:</strong>
                        </p>
                        <p>{projets.conteneursTermines}</p>
                      </div>
                    </>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalProjetOpen}
        onRequestClose={() => setIsModalProjetOpen(false)}
        contentLabel="Projet Modal"
        style={customStylesModal}
      >
        <h2>Creation projet</h2>

        <div className="input-container">
          <label htmlFor="type" className="input-label">
            Type de projet
          </label>
          <select
            className="input-field"
            value={type}
            onChange={handleSelectType}
            id="type"
          >
            <option
              value=""
              disabled
              hidden
              className=""
              style={{ color: "gray" }}
            >
              Type de projet
            </option>
            {optionsTypeProjet.map((option) => (
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
          <label htmlFor="Nom projet" className="input-label">
            Nom projet
          </label>
          <input
            placeholder="Nom projet"
            className="input-field"
            type="text"
            value={projet.nom_projet}
            onChange={(ev) =>
              setProjet({
                ...projet,
                nom_projet: ev.target.value,
              })
            }
            id="nom_projet"
          />
        </div>
        {!(projet.type === "Transfert" || projet.type === "Stockage") ? (
          <div className="input-container">
            <label htmlFor="Numero booking" className="input-label">
              Numero booking
            </label>
            <input
              placeholder="Numero booking"
              className="input-field"
              type="text"
              value={projet.num_booking}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  num_booking: ev.target.value,
                })
              }
              id="num_booking"
            />
          </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <button className="btn">Save</button>
        </form>
      </Modal>
      <Modal
        isOpen={isModalClientOpen}
        onRequestClose={() => setIsModalClientOpen(false)}
        contentLabel="Modification du Client"
        style={customStylesModalClient}
      >
        <h2>Creation client</h2>

        <div className="input-container">
          <label htmlFor="Nom" className="input-label">
            Nom
          </label>
          <input
            placeholder="Nom"
            className="input-field"
            type="text"
            value={client.nom}
            onChange={(ev) =>
              setClient({
                ...client,
                nom: ev.target.value,
              })
            }
            id="nom"
          />
        </div>
        <div className="input-container">
          <label htmlFor="Adresse" className="input-label">
            Adresse
          </label>
          <input
            placeholder="Adresse"
            className="input-field"
            type="text"
            value={client.adresse}
            onChange={(ev) =>
              setClient({
                ...client,
                adresse: ev.target.value,
              })
            }
            id="adresse"
          />
        </div>
        <div className="input-container">
          <label htmlFor="Contact client" className="input-label">
            Contact
          </label>
          <input
            placeholder="Contact client"
            className="input-field"
            type="text"
            value={client.contacte}
            onChange={(ev) =>
              setClient({
                ...client,
                contacte: ev.target.value,
              })
            }
            id="contact" // Ajoutez un id unique
          />
        </div>
        <div className="input-container">
          <label htmlFor="Contact client" className="input-label">
            Email
          </label>
          <input
            placeholder="Email"
            className="input-field"
            type="email"
            value={client.email}
            onChange={(ev) =>
              setClient({
                ...client,
                email: ev.target.value,
              })
            }
            id="email" // Ajoutez un id unique
          />
        </div>

        <form onSubmit={onClientUpdate}>
          <button className="btn">Enregistrer les modifications</button>
        </form>
      </Modal>
    </div>
  );
}
