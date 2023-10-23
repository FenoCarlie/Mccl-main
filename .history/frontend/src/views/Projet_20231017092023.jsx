import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import { iconsImgs } from "../icon/icone";
import axios from "axios";
import DataTable from "react-data-table-component";
import Modal from "react-modal";

export default function Projet() {
  const [filteredProjet, setFilteredProjet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalProjeOpen, setIsModalProjeOpen] = useState(false);
  const [isModalConteneurOpen, setIsModalConteneurOpen] = useState(false);
  const [isModalModifyProjeOpen, setIsModalModifyProjeOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState({});
  const [selectedFalseProjet, setSelectedFalseProjet] = useState("");
  const [projets, setProjets] = useState({
    client_projet: "",
    nom_projet: "",
    num_booking: "",
  });
  const [projet, setProjet] = useState([]);
  const [pfalse, setPfalse] = useState([]);
  const [containers, setContainers] = useState([]);
  const [projetToModify, setProjetToModify] = useState({});

  const [container, setContainer] = useState({
    num_container: "",
    line: "",
    shipment: "",
    booking: "",
    type: "",
    status: "",
    tare: "",
    client: "",
  });

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
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
  const optionsStatus = [
    { label: "Full", status: "Full" },
    { label: "Empty", status: "Empty" },
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
    setContainer((prevContainer) => ({
      ...prevContainer,
      type: ev.target.value,
    }));
  };

  const handleSelectStatus = (ev) => {
    setContainer({ ...container, status: ev.target.value });
    setStatus(ev.target.value);
  };

  const handleSelectLine = (ev) => {
    setContainer({ ...container, line: ev.target.value });
    setLine(ev.target.value);
  };

  const [numContainerError, setNumContainerError] = useState("");

  const handleNumContainerChange = (ev) => {
    let inputValue = ev.target.value;

    if (inputValue.length > 11) {
      inputValue = inputValue.slice(0, 11);
    }

    if (inputValue.length !== 11) {
      setNumContainerError("Must be 11 characters long.");
    } else if (!/^[A-Za-z]{4}\d{7}$/.test(inputValue)) {
      setNumContainerError("Must begin with 4 letters followed by 7 digits.");
    } else {
      setNumContainerError("");
    }
    setContainer({ ...container, num_container: ev.target.value });
  };

  const getProjetDetails = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/${projetId}`)
      .then(({ data }) => {
        setProjets(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const getProjetFalse = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/projet/false")
      .then(({ data }) => {
        setLoading(false);
        setPfalse(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  console.log("client_projet" + projets);
  const getProjet = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/get/projet")
      .then(({ data }) => {
        setLoading(false);
        setProjet(data);
        setFilteredProjet(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getConteneur = (conteneurId) => {
    setLoading(true);
    axios
      .get(`http://localhost:8081/projet/${conteneurId}`)
      .then(({ data }) => {
        setLoading(false);
        setContainers(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  console.log(projets);

  const handleProjetClick = (projetId) => {
    setSelectedProjet(projetId);
    getProjetDetails(projetId);
  };

  const onSubmitProjet = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/projet", {
        client_projet: projet.client_projet,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalProjeOpen(false);
        setErrors({});
        getProjet();
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
  };

  const handleModifyProjetClick = (projetId) => {
    axios
      .get(`http://localhost:8081/projet/${projetId}`)
      .then(({ data }) => {
        setProjetToModify(data);
        setIsModalModifyProjeOpen(true);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmitcontenaur = (ev) => {
    ev.preventDefault();
    axios
      .post("http://localhost:8081/create/conteneur", {
        client_projet: projet.client_projet,
        nom_projet: projet.nom_projet,
        num_booking: projet.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été créé avec succès");
        setIsModalConteneurOpen(false);
        setErrors({});
        getProjet();
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          setErrors({ general: "Une erreur s'est produite." });
        }
      });
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
    { name: "Id", selector: "id" },
    { name: "Projet", selector: "nom_projet" },
    { name: "Booking", selector: "num_booking" },
    { name: "Client", selector: "nom" },
    {
      cell: (row) => (
        <div>
          <button
            className="openModalBtn button_pers"
            onClick={() => {
              handleProjetClick(row.id);
              getConteneur(row.id);
            }}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </button>

          <button
            className="openModalBtn button_pers"
            onClick={() => handleModifyProjetClick(row.id)}
          >
            <img src={iconsImgs.edit} alt="" className="info_icon" />
          </button>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  const handleFilter = () => {
    if (Array.isArray(projet)) {
      const filteredData = projet.filter((item) => {
        return (
          item.nom_projet?.includes(searchQuery) ||
          item.num_booking?.includes(searchQuery) ||
          item.nom?.includes(searchQuery)
        );
      });
      setFilteredProjet(filteredData);
    }
  };

  const onModifyProjet = (ev) => {
    ev.preventDefault();
    // Mettez à jour les données du projet côté serveur en utilisant une requête PUT
    axios
      .put(`http://localhost:8081/projet/${projetToModify.id}`, {
        client_projet: projetToModify.client_projet,
        nom_projet: projetToModify.nom_projet,
        num_booking: projetToModify.num_booking,
      })
      .then(() => {
        setNotification("Le projet a été modifié avec succès");
        setIsModalProjeOpen(false); // Fermez la modal de modification
        // Vous pouvez également réinitialiser l'état de projetToModify si nécessaire
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
    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, projet]);

  const newProje = () => {
    setIsModalProjeOpen(true);
  };
  const newConteneur = () => {
    setIsModalConteneurOpen(true);
  };

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

  useEffect(() => {
    getProjet();
    getProjetFalse();
    getConteneur();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Projet</h1>
      </div>
      <div className="align">
        <div className="card animated fadeInDown">
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
          <DataTable
            columns={columnsToDisplay}
            data={filteredProjet}
            customStyles={customStyles}
            pagination
          />
        </div>
        

        <Modal
          isOpen={isModalProjeOpen}
          onRequestClose={() => setIsModalProjeOpen(false)}
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
              value={projet.client_projet}
              onChange={(ev) =>
                setProjet({
                  ...projet,
                  client_projet: ev.target.value,
                })
              }
              id="client_projet" // Ajoutez un id unique
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
              id="nom_projet" // Ajoutez un id unique
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
              id="num_booking" // Ajoutez un id unique
            />
          </div>

          <form onSubmit={onSubmitProjet}>
            <button className="btn">Save</button>
          </form>
        </Modal>
        <Modal
          isOpen={isModalModifyProjeOpen}
          onRequestOpen={() => setIsModalModifyProjeOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Modifier le projet</h2>

          <div className="input-container">
            <label htmlFor="client" className="input-label">
              Client
            </label>
            <input
              placeholder="Client"
              className="input-field"
              type="text"
              value={projetToModify.client_projet}
              onChange={(ev) =>
                setProjetToModify({
                  ...projetToModify,
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
              value={projetToModify.nom_projet}
              onChange={(ev) =>
                setProjetToModify({
                  ...projetToModify,
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
              value={projetToModify.num_booking}
              onChange={(ev) =>
                setProjetToModify({
                  ...projetToModify,
                  num_booking: ev.target.value,
                })
              }
              id="num_booking"
            />
          </div>

          <form onSubmit={onModifyProjet}>
            <button className="btn">Enregistrer</button>
          </form>
        </Modal>

        <Modal
          isOpen={isModalConteneurOpen}
          onRequestClose={() => setIsModalConteneurOpen(false)}
          contentLabel="Projet Modal"
          style={customStylesModal}
        >
          <h2>Ajout Conteneur</h2>

          <div className="input-container">
            <label htmlFor="selectProjet" className="input-label">
              Nom projet
            </label>
            <select
              className="input-field"
              id="selectProjet"
              value={selectedFalseProjet}
              onChange={(ev) => setSelectedFalseProjet(ev.target.value)}
            >
              <option value="" disabled>
                Sélectionnez un projet
              </option>
              {pfalse.map((falseProjet) => (
                <option key={falseProjet.id} value={falseProjet.id}>
                  {falseProjet.nom_projet}
                </option>
              ))}
            </select>
          </div>
          <div className="">
            <div className="input-container">
              <label htmlFor="num_container" className="input-label">
                Number of container
              </label>
              <input
                placeholder="Number of container"
                className="input-field"
                type="text"
                value={container.num_container}
                onChange={handleNumContainerChange}
                id="num_container"
                maxLength="11"
              />
              <span className="input-highlight"></span>
              {numContainerError && (
                <span className="input-error-message">{numContainerError}</span>
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
              <label htmlFor="status" className="input-label">
                Status
              </label>
              <select
                className="input-field"
                value={status}
                onChange={handleSelectStatus}
                id="status"
              >
                <option value="" disabled hidden style={{ color: "gray" }}>
                  Status
                </option>
                {optionsStatus.map((option) => (
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
                value={container.tare}
                onChange={(ev) =>
                  setContainer({ ...container, tare: ev.target.value })
                }
                id="tare" // Ajoutez un id unique
              />
              <span className="input-highlight"></span>
            </div>
          </div>

          <form onSubmit={onSubmitcontenaur}>
            <button className="btn">Save</button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
