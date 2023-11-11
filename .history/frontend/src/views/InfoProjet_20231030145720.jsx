import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import { iconsImgs } from "../icon/icone";
import { useStateContext } from "../context/ContextProvider.jsx";
import DataTable from "react-data-table-component";

export default function InfoProjet() {
  const { projetId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [projet, setProjet] = useState(null);
  const [filteredConteneur, setFilteredConteneur] = useState([]);
  const [conteneurs, setConteneurs] = useState([]);
  const [conteneuradd, setConteneuradd] = useState([]);
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
  const currentPath = window.location.pathname;
  const segments = currentPath.split("/");
  const pathWithoutLastSegment = segments.slice(0, -1).join("/");

  const customStylesModal = {
    content: {
      top: "35%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "600px",
      height: "600px",
      borderRadius: "15px",
    },
    overlay: {
      backgroundColor: "rgb(189 189 189 / 75%)",
    },
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#efefef",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const columns = [
    { name: "id", selector: "id" },
    { name: "Numero conteneur", selector: "num_conteneur" },

    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => handleSelectContainer(row)}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const handleSelectContainer = (container) => {
    setSelectedContainers((prev) => {
      const isContainerSelected = prev.some(
        (selectedContainer) => selectedContainer.id === container.id
      );

      if (isContainerSelected) {
        return prev.filter(
          (selectedContainer) => selectedContainer.id !== container.id
        );
      } else {
        return [...prev, container];
      }
    });
  };

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/conteneur")
      .then(({ data }) => {
        setLoading(false);
        setConteneuradd(data);
        setFilteredConteneur(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
      });
  };

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = conteneuradd.filter((item) => {
        return item.num_conteneur?.includes(searchQuery);
      });
      setFilteredConteneur(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, conteneuradd]);

  const getProjet = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/infoProjet/${projetId}`)
      .then(({ data }) => {
        setLoading(false);
        setProjet(data);
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
    getContainer();
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
                  <div className="card-header">
                    <h3>Information projet</h3>
                  </div>
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
                    Assigner des conteneurs
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
                      pathWithoutLastSegment === "/projet/infoProjet" ? (
                        <Link
                          to={`/projet/infoProjet/infoConteneur/${conteneur.id}`}
                        >
                          Terminer
                        </Link>
                      ) : (
                        <Link
                          to={`/client/infoClient/infoProjet/infoConteneur/${conteneur.id}`}
                        >
                          Terminer
                        </Link>
                      )
                    ) : pathWithoutLastSegment === "/projet/infoProjet" ? (
                      <Link
                        to={`/projet/infoProjet/infoConteneur/${conteneur.id}`}
                      >
                        Actif
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

        <div className="action">
          <div className="align">
            <label className="search-box">
              <button className="btn-search">
                <img className="info_icon" src={iconsImgs.loupe} alt="" />
              </button>
              <input
                type="text"
                className="input-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to Search..."
              />
            </label>
          </div>
        </div>
        <div className="align projet_conteneur">
          <DataTable
            columns={columnsToDisplay}
            data={filteredConteneur}
            customStyles={customStyles}
            noHeader
            responsive
            striped
            highlightOnHover
            pointerOnHover
          />
          <div>
            <div className="card containeradd">
              {selectedContainers.map((container) => (
                <p key={container.id}>{container.num_conteneur}</p>
              ))}
            </div>
            <form onSubmit={ajoutProjet}>
              <button className="btn">Ajouter</button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
