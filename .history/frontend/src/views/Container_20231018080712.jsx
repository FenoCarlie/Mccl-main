import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import InfoContainer from "./modals/InfoContainer";
import { iconsImgs } from "../icon/icone";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Container() {
  const [conteneurs, setConteneurs] = useState([]);
  const [projet, setProjet] = useState([]);
  const [filteredConteneur, setFilteredConteneur] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [id_get, setSelectedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalConteneurOpen, setIsModalConteneurOpen] = useState(false);
  const { setNotification } = useStateContext();
  const [selectedFalseProjet, setSelectedFalseProjet] = useState("");
  const [pfalse, setPfalse] = useState([]);
  const [conteneur, setConteneur] = useState({
    projet_id: "",
    num_conteneur: "",
    line: "",
    type: "",
    tare: "",
  });

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

  const columns = [
    { name: "id", selector: "id" },
    { name: "Numero conteneur", selector: "num_conteneur" },
    { name: "Tare", selector: "tare" },
    { name: "Line", selector: "line" },
    { name: "Type", selector: "type" },
    {
      cell: (row) => (
        <div>
          <Link
            className="openModalBtn button_pers"
            to={`/container/infoConteneur/${row.id}`}
          >
            <img src={iconsImgs.menu_points} alt="" className="info_icon" />
          </Link>
        </div>
      ),
    },
  ];

  const columnsToDisplay = columns.filter((column) => column.selector !== "id");

  const getContainer = () => {
    setLoading(true);
    axios
      .get("http://localhost:8081/conteneur")
      .then(({ data }) => {
        setLoading(false);
        setConteneurs(data);
        setFilteredConteneur(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("An error occurred while fetching the data:", error);
      });
  }; // Run only once when the component mounts

  useEffect(() => {
    const handleFilter = () => {
      const filteredData = conteneurs.filter((item) => {
        return (
          item.num_conteneur?.includes(searchQuery) ||
          item.type?.includes(searchQuery) ||
          item.tare?.includes(searchQuery) ||
          item.line?.includes(searchQuery)
        );
      });
      setFilteredConteneur(filteredData);
    };

    handleFilter();

    const debounceTimer = setTimeout(() => {
      handleFilter();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, conteneurs]);

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
        projet_id: conteneur.projet_id,
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
    getContainer();
    getProjetFalse();
  });

  return (
    <div>
      <div style={{ maxHeight: "900px", overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Conteneur</h1>

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
              <button
                className="btn-add"
                onClick={() => {
                  setIsModalConteneurOpen(true);
                }}
              >
                Nouveau Conteneur
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="card animated fadeInDown .table-container ">
            <DataTable
              columns={columnsToDisplay}
              data={filteredConteneur}
              customStyles={customStyles}
              pagination
            />
          </div>
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
                  <span className="input-error-message">
                    {numConteneurError}
                  </span>
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
            {console.log(pfalse.i)}

            <form onSubmit={onSubmit}>
              <button className="btn">Save</button>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
