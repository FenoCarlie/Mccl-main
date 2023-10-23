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
  const [projet, setProjet] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/projet", {
        client_projet: projet.client_id,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
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

  return (
    <div className="client">
      <h1>InfoClient</h1>
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div className="align">
          <div>
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
            <div className="action card">
              <div className="align ">
                <button
                  className="btn-add"
                  onClick={() => {
                    setIsModalProjetOpen(true);
                  }}
                >
                  Nouveau projet
                </button>
              </div>
            </div>
          </div>
          <div className="min-card">
            {projets.length === 0 ? (
              <>
                <div className="card projet-info-container">
                  <div className="align projet-info-header contenue">
                    <h2>Aucun projet</h2>
                  </div>
                </div>
              </>
            ) : (
              projets.map((projet) => (
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
                          <Link
                            to={`/client/infoClient/infoProjet/${projet.id}`}
                          >
                            Terminer
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={`/client/infoClient/infoProjet/${projet.id}`}
                          >
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
          <label htmlFor="client" className="input-label">
            Client
          </label>
          <input
            placeholder="Client"
            className="input-field"
            type="text"
            value={client.nom} // Utilisez le nom du client comme valeur initiale
            onChange={(ev) =>
              setProjet({
                ...projet,
                client_projet: ev.target.value,
              })
            }
            id="client_projet"
          />
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

        <form onSubmit={onSubmit}>
          <button className="btn">Save</button>
        </form>
      </Modal>
    </div>
  );
}